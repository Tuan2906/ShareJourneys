import cloudinary
from django.db.models import Avg, Prefetch, Count, Sum
from rest_framework import serializers

from ShareJourneysApp import paginators
from ShareJourneysApp.models import *
from django.core.serializers import serialize
import json
from rest_framework import permissions

class UserSerializer(serializers.ModelSerializer):

    avgRate = serializers.SerializerMethodField( read_only=True)
    def get_avgRate(self,obj):
        queryset = Rating.objects.filter(posts__user_id=obj.id).values('posts_id').annotate(
            total_count=Count('id'),
            avg_rate=Avg('rate')
        ).aggregate(
            total_average=Sum('avg_rate') / Count('posts_id')
        )
        avgRate = queryset['total_average']
        if avgRate is not None:
            return avgRate
        else:
            return 5



    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url
        return rep
    def create(self, validated_data):
        print(validated_data)
        data = validated_data.copy()
        print(data)
        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    class Meta:
        model = User
        fields =  ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar','avgRate']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class CreateSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        pictures = validated_data.pop('pictureUserSelect', [])
        picture_urls = []
        print('dawdaw',pictures)
        for pic_data in pictures:
            # Upload the image to Cloudinary
            print(' Upload the image to Cloudinary')
            result = cloudinary.uploader.upload(pic_data)
            # Append the URL of the uploaded image to the picture_urls list
            picture_urls.append(result['url'])

        # Save the uploaded picture URLs to the database
        jn = JourneyPictures.objects.create(picture=picture_urls)
        jn.save()
        return jn

    class Meta:
        model = JourneyPictures
        fields = ['id',"picture"]



# class UserDetailSerializer(UserSerializer):
#     posts_current_user = serializers.SerializerMethodField(read_only=True)
#     # def get_posts_current_user(self,obj):
#     #     request = self.context.get('request')
#     #     posts = Posts.objects.filter(user = obj).order_by('-id')
#     #     paginator = paginators.CommentPaginator()
#     #     page = paginator.paginate_queryset(comments, request)
#     #     if page is not None:
#     #         serializer = serializers.CommentSerializer(page, many=True)
#     #         return paginator.get_paginated_response(serializer.data)
#     #     return PostSerializer(posts,many=True).data
#     # def get_posts_current_user(self, obj):
#     #     print('acadw',self.context.get('request'))
#     #     request = self.context.get('request')
#     #     paginator = paginators.UserPostsPaginator
#     #     posts = Posts.objects.filter(user=obj).order_by('-id')
#     #     print(posts)
#     #     page = paginator.paginate_queryset(posts, request)
#     #     if page is not None:
#     #         serialized_posts = PostSerializer(page, many=True).data
#     #         return paginator.get_paginated_response(serialized_posts).data
#     #     else:
#     #         serialized_posts = PostSerializer(posts, many=True).data
#     #         return serialized_posts
#     class Meta:
#         model = UserSerializer.Meta.model
#         fields = UserSerializer.Meta.fields + ['posts_current_user']



class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['picture'] = instance.picture.url

        return rep


class TagSerializer (serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name']


class ImageSerializer(ItemSerializer):
    picture = serializers.ImageField()
    # def to_representation(self, instance):
    #     return instance.picture.url

    def create(self, validated_data):
        data = validated_data.copy()

        picture = JourneyPictures(**data)
        picture.save()

        return picture

    class Meta:
        model = JourneyPictures
        fields = ["id","picture"]


class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Rating
        fields = ['id', 'rate', "user"]



class TransportationsSerilializer (serializers.ModelSerializer):
    class Meta:
        model = Transportation
        fields = ['id','loai']


class LocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Local
        fields = ['id','diaChi']




class RouterSerializer(serializers.ModelSerializer):
    id_noiDi = LocalSerializer()
    id_noiDen = LocalSerializer()
    class Meta:
        model =Route
        fields = ['id_noiDi','id_noiDen']


class StopLocalSerializer(serializers.ModelSerializer):
    id_DiaDiem = LocalSerializer()
    class Meta:
        model = DiaDiemDungChan
        fields = ['ThoiGianDuKien', 'id_DiaDiem']


class JourneySerializer(serializers.ModelSerializer):
    # router
    id_tuyenDuong = RouterSerializer()
    id_PhuongTien = TransportationsSerilializer()
    stoplocal = serializers.SerializerMethodField(read_only=True)


    def get_stoplocal(self,obj):
        stop = DiaDiemDungChan.objects.filter(id_HanhTrinh = obj)
        return StopLocalSerializer(stop,many=True).data #json
    class Meta:
        model = Journey
        fields = ['chiPhi','ngayDi','ngayDen','id_tuyenDuong','id_PhuongTien','stoplocal']



class PostSerializer(serializers.ModelSerializer): # 1 user n post
    user = UserSerializer()
    journey = JourneySerializer(read_only=True)
    tags = TagSerializer(many=True,read_only=True)
    pic = ImageSerializer(many=True,read_only=True)
    avgRate = serializers.SerializerMethodField( read_only=True)
    def get_avgRate(self,obj):
        avgRate = Rating.objects.filter(posts = obj).aggregate(Avg('rate'))
        # avgRate = int(avgRate['rate__avg'])
        if avgRate.get('rate__avg') is not None:
            return avgRate['rate__avg']
        else:
            return 0

    # def to_representation(self, instance): # trả về biểu diễn của 1 object thay vì mặc định là dict
    #     rep = super().to_representation(instance)
    #     # Posts.objects.all().order_by('avgRate')
    #     # rep['pic'] = instance.pic.url
    #     return rep
    class Meta:
        model = Posts
        fields = ["user","id", "created_date","title",'journey', "tags",'pic','avgRate']

        # ordering = ['avgRate']  # Order posts by avgRate in descending order


class Posts_userSerializer(PostSerializer): # n user nhieu post
    user = UserSerializer()
    class Meta:
        model = PostSerializer.Meta.model
        fields = ['user'] +  PostSerializer.Meta.fields



class PostDetailSerializer(Posts_userSerializer):

    # diem dung chan
    # comments = serializers.SerializerMethodField()
    #
    # def get_comments(self,obj):
    #     comments = Comments.objects.filter(posts=obj)
    #     return CommentSerializer(comments,many=True).data
        tags = TagSerializer(many=True)
        pic = ImageSerializer(many=True)
        soLuongnguoiDiCung = serializers.SerializerMethodField()
        travelCompanion = serializers.SerializerMethodField()
        slRating = serializers.SerializerMethodField()



        def get_soLuongnguoiDiCung(self, obj):
            active_companions = obj.travelcompanion_set.filter(active=True)
            return active_companions.count()

        def get_travelCompanion(self, obj):
            companions = obj.travelcompanion_set.filter(active=True)
            user_ids = [companion.user.id for companion in companions]
            users = User.objects.filter(pk__in=user_ids)
            serialized_users = UserSerializer(users, many=True)  # Use UserSerializer
            return serialized_users.data

        def get_slRating(self, obj):
            active_rating = obj.rating_set.filter(active=True)
            return active_rating.count()

        class Meta:
            model = PostSerializer.Meta.model
            fields = PostSerializer.Meta.fields + ['content', 'tags', 'pic', 'soLuongnguoiDiCung', "travelCompanion",
                                                   "slRating","active"]

class TravelCompanionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelCompanion
        fields = [ 'timeselect']


class ReplySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        user = obj.user
        return {
            "username": user.username,
            "avatar": user.avatar.url if user.avatar else None
        }

    class Meta:
        model = CommentReply
        fields = ['id', 'content', 'created_date', 'user']

    # def create(self, validated_data):
    #     comment = Comments.objects.get(pk=validated_data.get('cmtRep'))
    #     reply = CommentReply.objects.create(cmtRep=comment, id=comment.id)
    #     reply.save()
    #     return reply


class TickSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentTick
        fields = ['id', 'active']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    reply_count = serializers.SerializerMethodField()
    tick = serializers.SerializerMethodField()

    class Meta:
        model = Comments
        fields = ['id', 'content', 'created_date', 'user', 'reply_count', 'tick']

    def get_reply_count(self, obj):
        return obj.comment_reply.count()

    def get_tick(self, obj):
        data = CommentTick.objects.filter(cmtTick = obj.id)
        return TickSerializer(data,many=True).data


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reports
        fields = ['id','reportContent']



class HistorySerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(source='posts__id')
    created_date = serializers.DateTimeField(source='posts__created_date')
    title = serializers.CharField(source='posts__title')
    content = serializers.CharField(source='posts__content')
    pic = serializers.SerializerMethodField()

    def get_pic(self,obj):
        post = Posts.objects.get(id = obj['posts__id'])
        related_pics = post.pic  # Assuming 'pic' is the ManyToManyField
        pic = related_pics.first()
        return ImageSerializer(pic).data

    class Meta:
        model = TravelCompanion
        fields = ['post_id', 'created_date', 'title', 'content','pic' ]


class HistoryOutComeSerializer(HistorySerializer):
    rate = serializers.SerializerMethodField()
    ngayDen = serializers.DateTimeField(source='posts__journey__ngayDen')

    def get_rate(self, obj):
        rating = Rating.objects.filter(posts=obj['posts__id'],user = obj['user_id']).first()
        return rating.rate if rating else None



    class Meta:
        model = HistorySerializer.Meta.model
        fields = HistorySerializer.Meta.fields + ['rate','ngayDen']



