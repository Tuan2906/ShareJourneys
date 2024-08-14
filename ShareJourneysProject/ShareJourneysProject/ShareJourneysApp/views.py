from datetime import datetime
import json

from django.contrib.auth.models import AnonymousUser
from django.db.models import Avg, Subquery, OuterRef, Q
from django.shortcuts import render
from django.utils import timezone

# Create your views here.
from django.shortcuts import render
from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework.views import APIView
from rest_framework import permissions, viewsets, generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from ShareJourneysApp import serializers,paginators, perm
from ShareJourneysApp.models import *
from rest_framework.decorators import action, api_view
from django.utils import timezone
import cloudinary.uploader

import cloudinary
import multiparse

# Create your views here.
from django.http import HttpResponse

from ShareJourneysApp.serializers import ImageSerializer, ReportSerializer


def index(request):
    return render(request, 'index.html', context={'name': 'Tuan'})

class  GetPostUser:
    @staticmethod
    def get_post_user(request,user):
        posts = Posts.objects.filter(user=user).order_by('-id')
        paginator = paginators.UserPostsPaginator()
        page = paginator.paginate_queryset(posts, request)
        if page is not None:
            serializer = serializers.PostSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        return Response(serializers.PostSerializer.data)


class UserViewSet(viewsets.ViewSet,generics.CreateAPIView, generics.RetrieveAPIView):
    # lay profile thi hien cac bai post cua user dc chon
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [MultiPartParser, ]


    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='posts', detail=True) # user/id/posts: cho xem trang cá nhan ng khac
    def get_posts_user(self, request,pk):
        user = self.get_object()
        return GetPostUser.get_post_user(request=request, user=user)


    @action(methods=['get'], url_path='current-user/posts', detail=False)
    def get_posts_current_user(self, request):
        print(request.user)
        user = request.user
        return GetPostUser.get_post_user(request=request, user=user)


    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)



class HistoryPost(viewsets.ViewSet):

    @action(methods=['get'], url_path='hisPost', detail=False)
    def listHisPost(self, request):
        user = self.request.user
        print(user.id)
        # Subquery to get the rate from Rating
        rate_subquery = Rating.objects.filter(
            posts_id=OuterRef('pk'),
            user_id=user.id
        ).values('rate')
        # rating_value = Rating.objects.filter(pk=Subquery(rate_subquery)).values_list('rate', flat=True).first()

        # Main queryset
        queryset = TravelCompanion.objects.filter(
            user_id=user.id,
            posts__journey__ngayDen__lt=timezone.now()
        ).select_related(
            'posts', 'posts__journey'
        ).annotate(

            rate=Subquery(rate_subquery)
        ).values(
            'posts__id',
            'posts__created_date',
            'posts__title',
            'posts__content',
            'timeselect',
            'rate',
            'posts__journey__ngayDen',
            'user_id'
        ).distinct()
        serializer = serializers.HistoryOutComeSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(methods=['get'], url_path='hisPostRegister', detail=False)
    def listHisPostRegister(self, request):
        user = self.request.user
        print(user.id)


        # Main queryset
        queryset = TravelCompanion.objects.filter(
            user_id=user.id,
            posts__journey__ngayDen__gte=timezone.now()
        ).select_related(
            'posts', 'posts__journey'
        ).values(
            'posts__id',
            'posts__created_date',
            'posts__title',
            'posts__content',
        ).distinct()
        serializer = serializers.HistorySerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)











class PostViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.RetrieveAPIView):
    queryset = Posts.objects.prefetch_related('tags')
    serializer_class = serializers.PostDetailSerializer

    def get_permissions(self):
        if self.action in ['add_comments', ' add_comment_reply', 'add_rating', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    @action(methods=["patch"], url_path="updatePost", detail=True, description="để khóa comment")
    def update_post(self, request, pk):
        print("Vo xem")
        try:
            lc = Posts.objects.get(id=pk)
            print(lc.active)
            if lc:
                print("Vo cap nhat active")
                lc.active = not lc.active
                lc.save()
        except Exception:
            return Response({'status': False, 'message': 'Bài post không tìm thấy'})

        return Response(serializers.PostDetailSerializer(lc).data)


    @action(methods=['post'], url_path='rates', detail=True,
            description="Lưu rating của user đó thuộc bài đăng đó")
    def add_rating(self, request, pk):
        c = self.get_object().rating_set.create(rate=request.data.get('rate'),
                                                user=request.user)
        return Response(serializers.RatingSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['post','get'], url_path='comments', detail=True)
    def add_comment(self, request, pk):
        if request.method.__eq__('POST'):
            c = self.get_object().comments_set.create(content=request.data.get('content'),
                                                     user=request.user)
            return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)
        elif request.method.__eq__('GET'):
            comments = self.get_object().comments_set.select_related('user').order_by('-id')
            paginator = paginators.CommentPaginator()
            page = paginator.paginate_queryset(comments, request)
            if page is not None:
                serializer = serializers.CommentSerializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)
            return Response(serializers.CommentSerializer(comments, many=True).data)

    @action(methods=['post'], url_path='comments/(?P<comment_id>[0-9]+)/tick', detail=True,
            description='Lưu ds nguời đi cùng được tick đồng thời lưu tạo mới tick ')
    def travelCompanion(self, request, pk, comment_id):
        # if comment_id:
        #     li, created =CommentTick.objects.get_or_create(cmtTick=)
        #     if not created:
        #         li.active = not li.active
        #         li.save()
        comment = Comments.objects.get(id=comment_id)
        if request.method.__eq__("POST"):
            print("vao duoc")
            print(self.get_object())
            print(request.user)
            li, created = TravelCompanion.objects.get_or_create(posts=self.get_object(),
                                                                user=User.objects.get(id=request.data.get("idUser")), active=True)
            lc, created_tic = CommentTick.objects.get_or_create(cmtTick=comment)
            print("chay duoc")
            print(lc)
            # cap nhat cai active
            if not created_tic:
                lc.active = not lc.active
                lc.save()
                if not lc.active:
                    print("voduoc xoa")
                    travelCompanion_Del = self.get_object().travelcompanion_set.filter(user=User.objects.get(id=request.data.get("idUser")))
                    travelCompanion_Del.delete()
                print("thoat dc")

            return Response(serializers.CommentSerializer(comment).data)

    @action(methods=["delete"], url_path='travelCompanion', detail=True,
            description="Xoa danh người đi của bài post đó")
    def del_travelCompanion(self, request, pk):
        if request.method.__eq__("DELETE"):
            print(request.data.get("idUser"))
            print(self.get_object().travelcompanion_set)
            travelCompanion_Del = self.get_object().travelcompanion_set.filter(user=User.objects.get(id=request.data.get("idUser")))
                # post = self.get_object()
            #
            # # comment=  Comments.objects.filter(user=User.objects.get(id=request.data.get("idUser"), posts = post))
            # comment = self.get_object().comments_set.filter(user=User.objects.get(id=request.data.get("idUser")))
            # print(comment)
            # cmtick = CommentTick.objects.get(cmtTick=comment)
            # cmtick.active = False
            # cmtick.save()
            travelCompanion_Del.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["patch"], url_path="editpost", detail=True, description="để chỉnh sửa bài viết")
    def update_post_user(self, request, pk):
        print("Vo xem")
        try:
            post_patch = self.get_object()
            start = Local.objects.get(pk=request.data.get('diemDi'))
            end = Local.objects.get(pk=request.data.get('diemDen'))
            router, bool_create = Route.objects.get_or_create(
                id_noiDi=start,
                id_noiDen=end
            )
            chiphi = request.data.get('chiPhi') if request.data.get('chiPhi') is not None else 0
            transport = Transportation.objects.get(pk=request.data.get('phuongtien'))
            journey, b = Journey.objects.get_or_create(
                chiPhi=chiphi,
                ngayDi=request.data.get('ngayDi'),
                ngayDen=request.data.get('ngayDen'),
                id_tuyenDuong=router,
                id_PhuongTien=transport
            )
            post_patch.content = request.data.get('content')
            post_patch.title = request.data.get('title')
            post_patch.journey = journey
            #tag
            tags_data = request.data.getlist('tag')
            tags_instances = []
            for tag in tags_data:
                tags_instances.append(Tag.objects.get(pk=int(tag)))
            post_patch.tags.set(tags_instances)


            # dia diem trung gian
            # for stop_data in json.loads(request.data.get('diaDiemTrungGian')):
            #     print('abcaida', type(stop_data))
            #     lc = Local.objects.get(pk=stop_data.get('iddiaDiem'))
            #     DiaDiemDungChan.objects.get_or_create(ThoiGianDuKien=stop_data.get('timedung')
            #                                           , id_DiaDiem_id=lc.id,
            #                                           id_HanhTrinh_id=journey.id)
            ## hình ảnh

            arrayPic = []
            # he thong
            for pic_data in request.data.getlist('pictureDaChon'):
                pc = JourneyPictures.objects.get(pk=int(pic_data))
                arrayPic.append(pc)

            # từ máy
            files = request.FILES.getlist('pictureUserSelect')
            base_url = f'https://res.cloudinary.com/{cloudinary.config().cloud_name}/'
            for file in files:
                result = cloudinary.uploader.upload(file)
                picture_url = result.get('secure_url').replace(base_url, '')
                if picture_url:
                    pic_instance = JourneyPictures(picture=picture_url)
                    arrayPic.append(pic_instance)
                    pic_instance.save()
            post_patch.pic.set(arrayPic)
            # xoa ảnh dc chọn từ máy
            # JourneyPictures.objects.filter(id__in=request.data.getlist('delPic')).delete()
            post_patch.save()




        except Exception :
            return Response({'status': False, 'message': 'Bài post không tìm thấy'})

        return Response(serializers.PostDetailSerializer(post_patch).data)


class ListPostViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Posts.objects.select_related('user','journey').filter(journey__ngayDi__gte =  datetime.now()).order_by('-created_date')
    serializer_class = serializers.Posts_userSerializer
    def get_queryset(self):
        queryset = Posts.objects.select_related('user','journey').filter(journey__ngayDi__gte =  datetime.now()).order_by('-created_date')
        print('dawdawdadwd',timezone.now().date())
        print(queryset)
        if self.action.__eq__('list'):
            jn = self.request.query_params.get('q')
            c = self.request.query_params.get('c')
            a = self.request.query_params.get('a')
            t = self.request.query_params.get('t')
            ti = self.request.query_params.get('ti')
            avg_rate_param = self.request.query_params.get('r')  # Tham số cho avgRate
            if jn and jn!='undefined':
                print('1')
                queryset = queryset.filter(title__icontains=jn)
            if c and c!='undefined':
                print('2')
                print(queryset)
                queryset = queryset.filter( journey__id_tuyenDuong__id_noiDi__id = c)
                print(queryset)
            if a and a!='undefined':
                print('3')
                print(queryset)
                queryset = queryset.filter(journey__id_tuyenDuong__id_noiDen__id = a)
                print(queryset)
            if t and t!='undefined':
                print('4')
                print(queryset)
                queryset = queryset.filter(tags__id = t)
                print(queryset)
            if ti and ti!='undefined':
                print('4')
                print(queryset)
                ti = datetime.strptime(ti, "%Y-%m-%d").date()
                print(ti)
                queryset = queryset.filter(journey__ngayDi__date__gte=ti)
                print(queryset)
            if avg_rate_param and avg_rate_param!='undefined':  # Kiểm tra nếu avgRate được truyền làm query parameter
                avg_rate = float(avg_rate_param)  # Chuyển đổi thành số dấu phẩy động
                queryset = queryset.annotate(avg_rate=Avg('rating__rate')).filter(avg_rate__range=[ avg_rate,  avg_rate+1]) # Tính trung bình các đánh giá

        return queryset




class LocalViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Local.objects.all()
    serializer_class = serializers.LocalSerializer


class TransportationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Transportation.objects.all()
    serializer_class = serializers.TransportationsSerilializer



class TagViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer

    # @action(methods=['get'], url_path='posts', detail=True)
    # def get_posts_by_tag(self,request,pk):
    #     post_with_tag = Posts.objects.filter(tags__id=pk).select_related('user').select_related('journey').filter(journey__ngayDi__gte = timezone.now())
    #     return Response(serializers.PostSerializer(post_with_tag,many=True).data, status=status.HTTP_200_OK)


# class TagViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
#     queryset = Posts.objects.filter(tags__id=d).select_related('user')
#     serializer_class = serializers.PostSerializer

class PictureViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = JourneyPictures.objects.all()
    serializer_class = serializers.ImageSerializer
    pagination_class = paginators.PicturePaginator



class PostALlViewSet(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        start = Local.objects.get(pk=request.data.get('diemDi'))
        end = Local.objects.get(pk=request.data.get('diemDen'))
        router, bool_create = Route.objects.get_or_create(
            id_noiDi=start,
            id_noiDen=end
        )
        chiphi = request.data.get('chiPhi') if request.data.get('chiPhi') is not None else 0
        transport = Transportation.objects.get(pk=request.data.get('phuongtien'))
        journey , b= Journey.objects.get_or_create(
            chiPhi= chiphi,
            ngayDi=request.data.get('ngayDi'),
            ngayDen=request.data.get('ngayDen'),
            id_tuyenDuong=router,
            id_PhuongTien=transport
        )

        tags_data = request.data.getlist('tag')


        content_data = request.data.get('content')

        # # stops_data = Local.objects.filter(diaChi = request.data.get('stop'))
        # # print('2')
        # #
        # #
        # # # Tạo mới các đối tượng user, journey và tags từ dữ liệu tương ứng
        # # # user_instance = User.objects.get_or_create(**user_data)
        # #
        tags_instances = []
        print(tags_data)
        print(request.data.get('pictureDaChon'))
        for tag in tags_data:
            tags_instances.append(Tag.objects.get(pk = int(tag)))
        #


        for stop_data in json.loads(request.data.get('diaDiemTrungGian')):
           print('abcaida',type(stop_data))
           lc =  Local.objects.get(pk = stop_data.get('iddiaDiem'))
           DiaDiemDungChan.objects.get_or_create(ThoiGianDuKien=stop_data.get('timedung')
                                                 , id_DiaDiem_id=lc.id,
                                                 id_HanhTrinh_id=journey.id)
        #
        # # # Tạo mới đối tượng Post từ request.data và các đối tượng đã tạo
        post_instance = Posts.objects.create(
            title = request.data.get('title'),
            user=request.user, #doi lai request user
            content=content_data,
            journey=journey,
        )
        arrayPic = []

        for pic_data in request.data.getlist('pictureDaChon'):
            pc = JourneyPictures.objects.get(pk=int(pic_data))
            arrayPic.append(pc)
        files = request.FILES.getlist('pictureUserSelect')
        base_url = f'https://res.cloudinary.com/{cloudinary.config().cloud_name}/'
        for file in files:
            result = cloudinary.uploader.upload(file)
            picture_url = result.get('secure_url').replace(base_url, '')
            if picture_url:
                pic_instance = JourneyPictures(picture=picture_url)
                arrayPic.append(pic_instance)
                pic_instance.save()

        # Gán tags cho post_instance (n-n)
        post_instance.pic.set(arrayPic)
        post_instance.tags.set(tags_instances)
        post_instance.save()
        return Response(serializers.PostDetailSerializer(post_instance).data,status=status.HTTP_201_CREATED)


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comments.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perm.CommentOwner]
    def get_permissions(self):
        if self.action in ['add_and_get_comment_reply'] and self.request.POST:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['patch'], url_path='', detail=True)
    def patch_comment(self, request,pk):
        comment = Comments.objects.get(pk =self.get_object().id)
        print(comment)
        print(self.get_object())
        if request.method.__eq__('PATCH'):
            updated_data = request.data

            # Cập nhật dữ liệu của comment từ dữ liệu mới
            comment.content = updated_data.get('content', comment.content)
            # Cập nhật các trường khác nếu cần thiết

            # Lưu lại comment đã cập nhật vào cơ sở dữ liệu
            comment.save()

        return Response(serializers.CommentSerializer(self.get_object()).data)



    @action(methods=['post', 'get'], url_path='replies', detail=True,
            description="Lay va luu danh sach rep cua 1 comment")
    def add_and_get_comment_reply(self, request, pk):
        comment = self.get_object()
        if request.method.__eq__('POST'):
            reply = CommentReply.objects.create(cmtRep=comment,content=request.data.get('content'), user=request.user)
            return Response(serializers.CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        if request.method.__eq__('GET'):
            rep = comment.comment_reply.all().order_by("-created_date")
            return Response(serializers.ReplySerializer(rep, many=True).data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_408_REQUEST_TIMEOUT)



# class PostChangedViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
#     queryset = Posts.objects.all()
#     serializer_class = serializers.PostDetailSerializer
#     permission_classes = [perm.PostOwner]




class ReportViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Reports.objects.all()
    serializers_class = serializers.ReportSerializer

    def get_serializer_class(self):
        return ReportSerializer

    @action(methods=['post'], url_path='userReport', detail=True, description="Lưu user nào bị report nào")
    def UserReport(self, request, pk):
        ur_create = Users_Report.objects.create(report=self.get_object(),
                                                user=User.objects.get(id=request.data.get("idUser")))
        return Response(status=status.HTTP_201_CREATED)



class SendEmail(APIView):
    def post(self, request):
        if request.method == 'POST':
            client_email = "chuongngo178@gmail.com"
            email = request.data
            nd = email.get('nd') + "\n" + "Người Vi pham:" + email.get('user')
            print(email)
            email_word = EmailMessage('Report user',
                                      nd,
                                      client_email,
                                      [client_email])
            email_word.send(fail_silently=False)
            return Response({'status': True, 'message': 'Email send sucesss'})



