from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    avatar = CloudinaryField(null=True)


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class JourneyPictures(BaseModel):
    picture = CloudinaryField(null=False)


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class ItemBase(BaseModel):
    tags = models.ManyToManyField(Tag)

    class Meta:
        abstract = True


class Posts(ItemBase):
    title =models.CharField(max_length=255, default=None)
    content = RichTextField(null=True)
    state = models.CharField(max_length=255, null=False)
    pic = models.ManyToManyField(JourneyPictures, related_name='pictures')
    journey = models.ForeignKey('Journey',on_delete= models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post')

    def __str__(self):
        return self.title



class Reports(BaseModel):
    reportContent = models.CharField(max_length=255, null=False)

    def __str__(self):
        return self.reportContent


class Users_Report(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    report = models.ForeignKey(Reports, on_delete=models.CASCADE, related_name='report')


class Interaction(BaseModel):
    posts = models.ForeignKey(Posts, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Comments(Interaction):
    content = models.CharField(max_length=255, null=False)


    def __str__(self):
        return self.content


class CommentTick(BaseModel):
    cmtTick = models.OneToOneField(Comments, on_delete=models.CASCADE, related_name='ticks')


class CommentReply(BaseModel):
    cmtRep = models.ForeignKey(Comments, on_delete=models.CASCADE, related_name='comment_reply')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=255, null=False)

    def __str__(self):
        return self.content

class Rating(Interaction):
    rate = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])

    class Meta:
        unique_together = ('posts', 'user')


class TravelCompanion(Interaction):
    timeselect = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)


class Local(models.Model):
    diaChi = models.CharField(max_length=25)

    def __str__(self):
        return self.diaChi


class Journey(models.Model):
    chiPhi = models.FloatField(default=0)
    ngayDi = models.DateTimeField()
    ngayDen = models.DateTimeField()
    id_tuyenDuong = models.ForeignKey('Route', on_delete=models.SET_NULL, null=True, related_name='tuyenDuong')
    id_PhuongTien = models.ForeignKey('Transportation', on_delete=models.SET_NULL, null=True, blank=True,
                                      related_name='phuongTien')

    def __str__(self):
        return str(self.id_tuyenDuong)

class Transportation(models.Model):
    loai = models.CharField(max_length=15)

    def __str__(self):
        return self.loai


class DiaDiemDungChan(models.Model):
    ThoiGianDuKien = models.DateTimeField(default="2024-06-30T00:00:00Z")
    id_DiaDiem = models.ForeignKey(Local, on_delete=models.CASCADE, related_name='diaDiem')
    id_HanhTrinh = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='hanhTrinh')


class Route(models.Model):
    id_noiDi = models.ForeignKey(Local, on_delete=models.CASCADE, related_name='noiDi')
    id_noiDen = models.ForeignKey(Local, on_delete=models.CASCADE, related_name='noiDen')

    def __str__(self):
        return str(self.id_noiDi) +"-"+str(self.id_noiDen)
