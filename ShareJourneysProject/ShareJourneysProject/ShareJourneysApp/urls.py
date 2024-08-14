from django.urls import path,include
from ShareJourneysApp import views
from .views import *
from  rest_framework.routers import DefaultRouter
route= DefaultRouter()
route.register('users',views.UserViewSet,basename='users')
route.register('posts',views.PostViewSet,basename='posts')
route.register('allposts',views.ListPostViewSet,basename='allposts')
# route.register('allpostss',views.PostALlViewSet,basename='allpostss')
route.register('local',views.LocalViewSet,basename='local')
route.register('picture',views.PictureViewSet,basename='picture')
route.register('transports',views.TransportationViewSet,basename='transports')
route.register('tags',views.TagViewSet,basename='tags')
route.register('comments', views.CommentViewSet, basename='comment')
# route.register('post', views.PostChangedViewSet, basename='post')
route.register('reports', views.ReportViewSet, basename='report')
route.register('history', views.HistoryPost, basename='history')

urlpatterns = [
    path('', include(route.urls)),
    path('api/send/mail', SendEmail.as_view(), name='Trang Chu'),
    path('api/post/', PostALlViewSet.as_view(), name='post'),

]