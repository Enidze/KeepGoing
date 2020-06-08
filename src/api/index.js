import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

export let course = (operation,param) => {
    return axios({
        method: "post",
        dataType: "json",
        url: `/course?operation=${operation}`,
        data: {data:JSON.stringify(param)}
    });
};

export let action = (operation,param) => {
    return axios({
        method: "post",
        dataType: "json",
        url: `/action?operation=${operation}`,
        data: {data:JSON.stringify(param)}
    });
};

export let courseDate = (operation,param) => {
    return axios({
        method: "post",
        dataType: "json",
        url: `/course-date?operation=${operation}`,
        data: {data:JSON.stringify(param)}
    });
};

export let food = (operation,param) => {
    return axios({
        method: "post",
        dataType: "json",
        url: `/food?operation=${operation}`,
        data: {data:JSON.stringify(param)}
    });
};

export let foodSort = (operation,param) => {
    return axios({
        method: "post",
        dataType: "json",
        url: `/foodSort?operation=${operation}`,
        data: {data:JSON.stringify(param)}
    });
};

export let articles = (operation,param) => {
    return axios({
        method: "post",
        dataType: "json",
        url: `/articles?operation=${operation}`,
        data: {data:JSON.stringify(param)}
    });
};

export let article = (param) => {
    return axios({
        method: "post",
        dataType: "json",
        url: `/articleFiles`,
        data: {data:JSON.stringify(param)}
    });
};

export let coach = (operation,param) =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/coach?operation=${operation}`,
        data:{data:JSON.stringify(param)}
    });
};

export let register = param =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/register`,
        data:{data:JSON.stringify(param)}
    });
};

export let login = param =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/login`,
        data:{data:JSON.stringify(param)}
    });
};

export let exit = param =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/exit`,
        data:{data:JSON.stringify(param)}
    })
};

export let userInfo = (operation,param) =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/userInfo?operation=${operation}`,
        data:{data:JSON.stringify(param)}
    })
};

export let userCollect = (collectSort,param) =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/userCollect?collectSort=${collectSort}`,
        data:{data:JSON.stringify(param)}
    })
};

export let userApply = (param) =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/userApply`,
        data:{data:JSON.stringify(param)}
    })
};

export let userConfirm = (param) =>{
    return axios({
        method:'post',
        dataType:'json',
        url:`/userConfirm`,
        data:{data:JSON.stringify(param)}
    })
};
