import axios from "axios";

// const BASE_URL = 'https://chuongngo178.pythonanywhere.com/';
const BASE_URL = 'http://192.168.1.3:8000/';

export const endpoints = {
    'local': '/local/',
    'picture': '/picture/',
     'transport': '/transports/',
     'tag':'/tags/',
     'report':"/reports/",
     'users': "/users/",
     'allposts':"/allposts/",
     'posts': (post_id) => `/posts/${post_id}/`,
     'comments': (post_id) => `/posts/${post_id}/comments/`,
     'reply': (comment_id) => `/comments/${comment_id}/replies/`,
     'login': '/o/token/',
     'current-user': '/users/current-user/',
     'add-comment': (post_id) => `/posts/${post_id}/comments/`,
     'add-rep': (comment_id) => `/comments/${comment_id}/replies/`,
     'add-tick': (post_id,comment_id) => `/posts/${post_id}/comments/${comment_id}/tick/`,
    'deleteCompanion':  (post_id) => `/posts/${post_id}/travelCompanion/`,
    'report':"/reports/",
    'reportUser': (reportId) => `/reports/${reportId}/userReport/`,
    'user': (id_user) => `/users/${id_user}/`, // Lấy trang cá nhan ng khác (K phải dang nhap)
    'post_user': (id_user) => `/users/${id_user}/posts/`,
    'post_current_user':`/users/current-user/posts/`,
    'deletePost':(postId) => `/posts/${postId}/`,
    'apiEmail':"/api/send/mail",
    'updatePost': (post_id) => `/posts/${post_id}/updatePost/`,
    'hisPostRegister': "history/hisPostRegister/",
    'historyPost': "history/hisPost/",
    'rates':(rateId)=>`/posts/${rateId}/rates/`,
    'UpPost': "/api/post/",
    'editPost': (post_id) => `/posts/${post_id}/editpost/`,

};
export const authApi = (accessToken) => axios.create({
    baseURL: BASE_URL,
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
})
export default axios.create({
    baseURL: BASE_URL
});