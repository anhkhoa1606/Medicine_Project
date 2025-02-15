import axios from '../axios';
import * as queryString from 'query-string';

const adminService = {

    login(loginBody) {
        return axios.post(`/admin/login`, loginBody)
    },

};

export default adminService;