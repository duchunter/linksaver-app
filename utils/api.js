import axios from 'axios';
import { getAccessToken } from './auth';

const BASE_URL = 'https://gp-linksaver.herokuapp.com';

export {
  getInfo, searchLink, addLink, editLink,
  adjustLink, deleteLink, sendLog,
};

// Return the latest version of a link
async function checkLink(link, table, id) {
  try {
    let result = await searchLink({
      table,
      mode: 'all',
      condition: { link, id }
    });

    return result.data[0] || { err: 'empty'};
  } catch (err) {
    return { err };
  }
}

// No requirement
async function sendLog() {
  const url = `${BASE_URL}/api/log`;
  const accessToken = {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };
  return await axios.post(url, {}, accessToken);
}

// Require table and condition (optional)
async function getInfo(data) {
  const url = `${BASE_URL}/api/info`;
  const accessToken = {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };
  let result = await axios.post(url, data, accessToken);
  return result.data;
}

// Require mode, table, condition, limit
async function searchLink(data) {
  const url = `${BASE_URL}/api/search`;
  const accessToken = {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };
  return await axios.post(url, data, accessToken);
}

// Require direct and data
async function addLink(data, direct) {
  let getMainSample = checkLink(data.link, 'Main');
  let getTempSample = checkLink(data.link, 'Temp');

  let sample1 = await getMainSample;
  let sample2 = await getTempSample;

  if (sample1.err && sample2.err) {
    if (sample1.err == 'empty' && sample2.err == 'empty') {
      const url = `${BASE_URL}/api/add`;
      const accessToken = {
        headers: { Authorization: `Bearer ${getAccessToken()}` }
      };
      return await axios.put(url, { direct, data }, accessToken);
    }

    return new Promise((resolve, reject) => {
      reject(
        `Error getting sample:
        main: ${JSON.stringify(sample1.err)}
        temp: ${JSON.stringify(sample2.err)}`
      );
    });
  }

  return new Promise((resolve, reject) => {
    reject({
      response: {
        status: 409,
        data: 'Link already exist, please update'
      }
    });
  });
}

// Require id, table, changes, link
async function editLink(data, inAppSample) {
  let sample = await checkLink(data.link, data.table);
  if (sample.err) {
    return new Promise((resolve, reject) => {
      reject(JSON.stringify(sample.err));
    });
  }

  // Check info in app must be the same with server db before edit
  for (let key in sample) {
    if (sample[key] != inAppSample[key]) {
      return new Promise((resolve, reject) => {
        reject('Data mismatch, please update');
      });
    }
  }

  const url = `${BASE_URL}/api/edit`;
  const accessToken = {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };
  return await axios.post(url, data, accessToken);
}

// Require promote, id
async function adjustLink(data, inAppSample) {
  let sample = await checkLink(null, data.promote ? 'Temp' : 'Main', data.id);
  if (sample.err) {
    return new Promise((resolve, reject) => {
      reject(JSON.stringify(sample.err));
    });
  }

  // Check info in app must be the same with server db before edit
  for (let key in sample) {
    if (sample[key] != inAppSample[key]) {
      return new Promise((resolve, reject) => {
        reject('Data mismatch, please update');
      });
    }
  }

  const url = `${BASE_URL}/api/adjust`;
  const accessToken = {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };
  return await axios.post(url, data, accessToken);
}

// Require table, id, link
async function deleteLink(data, inAppSample) {
  let sample = await checkLink(data.link, data.table, data.id);
  if (sample.err) {
    return new Promise((resolve, reject) => {
      reject(JSON.stringify(sample.err));
    });
  }

  // Check info in app must be the same with server db before edit
  for (let key in sample) {
    if (sample[key] != inAppSample[key]) {
      return new Promise((resolve, reject) => {
        reject('Data mismatch, please update');
      });
    }
  }

  const url = `${BASE_URL}/api/delete`;
  const accessToken = {
    headers: { Authorization: `Bearer ${getAccessToken()}` }
  };
  return await axios.post(url, data, accessToken);
}
