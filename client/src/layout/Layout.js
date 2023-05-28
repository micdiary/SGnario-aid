import { Layout as AntLayout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import * as constants from "../constants";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Tutorial from "../pages/Tutorial";
import Contact from "../pages/Contact";
import TermsConditions from "../pages/TermsConditions";
import Account from "../pages/Account";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NoMatch from "../pages/NoMatch";
import Records from "../pages/RecordsList"

const { Header: AntHeader, Footer: AntFooter, Content } = AntLayout;

const Layout = () => {
  return (
    <BrowserRouter>
      <AntLayout>
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
            <Route exact path={constants.HOME_URL} element={<Home />}/>
            <Route path={constants.ABOUT_US_URL} element={<AboutUs />}/>
            <Route path={constants.TUTORIAL_URL} element={<Tutorial />}/>
            <Route path={constants.CONTACT_URL} element={<Contact />}/>
            <Route path={constants.TERMS_CONDITIONS_URL} element={<TermsConditions />}/>
            <Route path={constants.ACCOUNT_URL} element={<Account />}/>
            <Route path={constants.RECORDS} element={<Records />}/>
            <Route path={constants.LOGIN_URL} element={<Login />}/>
            <Route path={constants.REGISTER_URL} element={<Register />}/>
            <Route path="*" element={<NoMatch />}/>  
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
