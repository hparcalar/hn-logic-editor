export const checkAuthRoute = (router: any, requestedPage: String): boolean => {
  try {
    if (!localStorage.getItem('hn_user')) {
      if (requestedPage !== 'login') {
        router.push({ name: 'login' });
        return true;
      }
    }
    else {
      if (requestedPage === 'login') {
        router.push({ name: 'logic' });
        return true;
      }
    }
  }
  catch (err) {

  }

  return false;
};

export default checkAuthRoute;
