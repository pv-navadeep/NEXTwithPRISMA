import axios from 'axios';
const API_URL= "http://localhost:8000"

export async function  login (){
    const params = new URLSearchParams();
    params.append('username',username);
    params.append('password',password);

    const response = await axios.post(`${API_URL}/token`,params,{
        headers:{'Content-Type' : 'application/x-www-form-urlencoded'}
    });
    return response.data;
}