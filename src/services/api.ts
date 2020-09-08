import request from '@/utils/request';

export async function query(params: any, url: string): Promise<any> {
  return request(url, {
    method: 'GET',
    params,
  });
}

export async function queryPost(data: any, url: string): Promise<any> {
  return request(url, {
    method: 'POST',
    data,
  });
}

export async function create(data: any, url: string): Promise<any> {
  return request(url, {
    method: 'POST',
    data,
  });
}

export async function update(data: any, url: string): Promise<any> {
  return request(url, {
    method: 'POST',
    data,
  });
}

export async function remove(data: any, url: string): Promise<any> {
  return request(url, {
    method: 'POST',
    data,
  });
}
