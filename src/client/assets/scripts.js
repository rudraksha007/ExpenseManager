import FingerprintJS from '@fingerprintjs/fingerprintjs';

const mainUrl = '/api/';
let fpPromise = null;
let fingerPrint = null;
async function initialize() {
    fpPromise = await FingerprintJS.load();
    fingerPrint = (await fpPromise.get()).visitorId;
}

async function fetchData(url, method) {
    return (await fetchDataWithParams(url, method, {}));
}

async function fetchDataWithParams(url, method, data) {
    try {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();  
            }, 1000);
        });
        const response = await fetch('/api/' + url,
            {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...data, fingerPrint: fingerPrint })
            });
        const res = await response.json();
        if (!response.ok) {
            console.log('Fetch Failed');
            console.log(res.message);
            return { reqStatus: 'failed', message: res.message };
        }
        return { ...res, reqStatus: 'success' };
    } catch (error) {
        console.log('There has been a problem with your fetch operation:');
        console.log(error);

        return null;
    }
}

async function fetchDataWithFileUpload(url, method, form, extraData) {
    const fileInput = Array.from(form.children).find(child => child.type === 'file');
    const formData = new FormData(form);
    if (fileInput && fileInput.files.length > 0) {
        formData.append('BillCopy', fileInput.files[0]);
    }
    if (extraData && typeof extraData === 'object') {
        Object.keys(extraData).forEach(key => {
            formData.append(key, extraData[key]);
        });
    }
    try {
        formData.append('fingerPrint', fingerPrint);
        console.log(Object.fromEntries(formData.entries()));

        const response = await fetch('/api/' + url, {
            method: method,
            body: formData,
        });
        const res = await response.json();
        if (!response.ok) {
            console.log('Fetch Failed');
            console.log(res.message);
            return { reqStatus: 'failed', message: res.message };
        }
        return { ...res, reqStatus: 'success' };
    } catch (error) {
        console.log('There has been a problem with your fetch operation:');
        console.log(error);
        return null;
    }
}
async function autoLogin() {

    const res = await fetchDataWithParams('autoLogin', 'post', { fingerPrint: fingerPrint });
    if (res.reqStatus != 'success') {
        return false;
    }
    return res;
}
async function login(setProfile) {
    if (!fingerPrint) {
        const fpPromise = await FingerprintJS.load();
        fingerPrint = (await fpPromise.get()).visitorId;
    }
    console.log(fingerPrint);

    const userProfile = await fetchData('login', 'post');
    if (!userProfile) {
        return false;
    }
    setProfile(userProfile);
    return true;
}

export { fetchData, login, fetchDataWithParams, autoLogin, fetchDataWithFileUpload, initialize };