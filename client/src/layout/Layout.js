import { Layout as AntLayout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import * as constants from "../constants";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Tutorial from "../pages/Tutorial";
import Contact from "../pages/Contact";
import TermsConditions from "../pages/TermsConditions";
import Account from "../pages/Account/Account";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NoMatch from "../pages/NoMatch";
import Admin from "../pages/Admin/Admin";
import Scenarios from "../pages/Scenarios";

import ForgetPassword from "../pages/ForgetPassword";
import ProtectedRoute from "./ProtectedRoute";

import { getUserID } from "../utils/account";
import { userStore } from "../utils/store";
import ResetPassword from "../pages/ResetPassword";

const { Header: AntHeader, Footer: AntFooter, Content } = AntLayout;

const Layout = () => {
  const localUserID = getUserID();
  const storeUserID = userStore((state) => state.userID);
  const [userID, setUserID] = useState(
    localUserID !== null ? localUserID : storeUserID
  );
  useEffect(() => {
    setUserID(localUserID !== null ? localUserID : storeUserID);
  }, [localUserID, storeUserID]);

  return (
    <BrowserRouter>
      <AntLayout
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <AntHeader className="header">
          <Header />
        </AntHeader>
        <Content
          style={{
            padding: "0 50px",
            marginTop: 24,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route exact path={constants.HOME_URL} element={<Home />} />
            <Route path={constants.SCENARIOS_URL} element={<Scenarios />} />
            <Route path={constants.ABOUT_US_URL} element={<AboutUs />} />
            <Route path={constants.TUTORIAL_URL} element={<Tutorial />} />
            <Route path={constants.CONTACT_URL} element={<Contact />} />
            <Route
              path={constants.TERMS_CONDITIONS_URL}
              element={<TermsConditions />}
            />
            <Route path={constants.LOGIN_URL} element={<Login />} />
            <Route path={constants.REGISTER_URL} element={<Register />} />
            <Route
              path={constants.FORGET_PASSWORD_URL}
              element={<ForgetPassword />}
            />
            <Route
              path={constants.RESET_PASSWORD_URL}
              element={<ResetPassword />}
            />
            <Route path="*" element={<NoMatch />} />
            {/* PROTECTED ROUTES */}
            <Route
              path={constants.ACCOUNT_URL}
              element={
                <ProtectedRoute user={userID}>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path={constants.ADMIN_URL}
              element={
                <ProtectedRoute user={userID}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
        <AntFooter
          style={{
            textAlign: "center",
          }}
        >
          <Footer />
        </AntFooter>
      </AntLayout>
    </BrowserRouter>
  );
};
export default Layout;
