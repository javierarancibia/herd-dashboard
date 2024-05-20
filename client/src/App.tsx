import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import ProtectedRouteWrapper from './pages/Authentication/ProtectedRouteWrapper';
import DefaultLayout from './layout/DefaultLayout';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import useAuth from './hooks/Auth/useAuth';
import axios from 'axios';
import ScrollToTopHelper from './Helpers/ScrollToTopHelper';
import Accounts from './pages/Accounts/Accounts';
import CreateAccount from './pages/Accounts/CreateAccount';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuth()
  // Effect to trigger Loader
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  // Effect to set config values
  const fetchConfig = async (path: any) => {
    let response = await axios(path);
    if (response.status) {
      return response.data
    }
    throw new Error('No config')
  };

  // Effect to set config values into global state
  useEffect(() => {
    fetchConfig("/config.json")
      .then((data: any) => {
        auth?.setApiUrl(data.api_url)
    })
  }, [])

  // Effect to store user data in headers
  // useEffect(() => {
  //   if (auth && auth?.clientUser) {
  //     return auth.setAxiosOptions({ ...auth.axiosOptions, headers: { Authorization: auth.clientUser.token } })
  //   }
  // }, [auth?.clientUser])

  // Loader
  if (loading) return <Loader />

  // Render App
  if (auth?.apiUrl) {
    return (
        // <GoogleOAuthProvider clientId={auth.googleClientId}>
            <ScrollToTopHelper>
              <Routes>
                {/* Authenticaciont Routes */}
                <Route index
                  element={
                    <>
                      <PageTitle title="Sign In | Hodl Client Desk" />
                      <SignIn />
                    </>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <>
                      <PageTitle title="Signup | Hodl Client Desk" />
                      <SignUp />
                    </>
                  }
                />
               
                {/* Protected Routes */}
                <Route path="main" element={<ProtectedRouteWrapper> <DefaultLayout /></ProtectedRouteWrapper>}>
                  <Route
                      path="/main/accounts"
                      element={
                        <>
                          <PageTitle title="Accounts | Hodl Client Desk" />
                          <Accounts />
                        </>
                      }
                  />
                  <Route
                    path="/main/accounts/create"
                    element={
                      <>
                        <PageTitle title="Create Account | Hodl Client Desk" />
                        <CreateAccount />
                      </>
                    }
                  />

                  <Route
                    path="/main/calendar"
                    element={
                      <>
                        <PageTitle title="Calendar | Hodl Client Desk" />
                        <Calendar />
                      </>
                    }
                  />
                  <Route
                    path="/main/profile"
                    element={
                      <>
                        <PageTitle title="Profile | Hodl Client Desk" />
                        <Profile />
                      </>
                    }
                  />
                  <Route
                    path="/main/forms/form-elements"
                    element={
                      <>
                        <PageTitle title="Form Elements | Hodl Client Desk" />
                        <FormElements />
                      </>
                    }
                  />
                  <Route
                    path="/main/forms/form-layout"
                    element={
                      <>
                        <PageTitle title="Form Layout | Hodl Client Desk" />
                        <FormLayout />
                      </>
                    }
                  />
                  <Route
                    path="/main/tables"
                    element={
                      <>
                        <PageTitle title="Tables | Hodl Client Desk" />
                        <Tables />
                      </>
                    }
                  />
                  <Route
                    path="/main/settings"
                    element={
                      <>
                        <PageTitle title="Settings | Hodl Client Desk" />
                        <Settings />
                      </>
                    }
                  />
                  <Route
                    path="/main/chart"
                    element={
                      <>
                        <PageTitle title="Basic Chart | Hodl Client Desk" />
                        <Chart />
                      </>
                    }
                  />
                  <Route
                    path="/main/ui/alerts"
                    element={
                      <>
                        <PageTitle title="Alerts | Hodl Client Desk" />
                        <Alerts />
                      </>
                    }
                  />
                  <Route
                    path="/main/ui/buttons"
                    element={
                      <>
                        <PageTitle title="Buttons | Hodl Client Desk" />
                        <Buttons />
                      </>
                    }
                  />
                   <Route
                    path="/main/ecommerce"
                    element={
                      <>
                        <PageTitle title="Buttons | Hodl Client Desk" />
                        <ECommerce />
                      </>
                    }
                  />
                  <Route
                    path="/main/auth/signin"
                    element={
                      <>
                        <PageTitle title="Signin | Hodl Client Desk" />
                        <SignIn />
                      </>
                    }
                  />
                </Route>
              </Routes>
            </ScrollToTopHelper>
        // </GoogleOAuthProvider>
    );
  }
}

export default App;
