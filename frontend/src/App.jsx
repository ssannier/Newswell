import React, { memo, useEffect } from "react";
import AppLayout from "./components/AppLayout"; // Import the main layout component
import "./App.css"; // Import any global styles
import { useState, createContext } from "react";
import axios from "axios";
import { getDayOfWeek, getFormattedDate } from "./components/NewspaperLayout";
export const LayoutContext = createContext();
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useHistoryState from "./utils/useHistoryState";

import { Amplify } from "aws-amplify";
import LoginPage from "./components/LoginPage";
import { signOut } from "aws-amplify/auth";

export const Context = React.createContext();
const env = import.meta.env;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: "us-west-2_Zmc6C1Xzy", // Your Cognito User Pool ID
        userPoolClientId: "7o0iqulv5dn96fv7ntro1jdqlc", // Your App Client ID
        identityPoolId: "us-west-2:f5d16473-a78f-4636-bcc5-6c3f483c3423", // Optional: Identity Pool ID if using Federated Identities
        loginWith: {
          email: true, // Login using email
        },
        signUpVerificationMethod: "code", // Code-based verification during sign-up
        userAttributes: {
          email: {
            required: true, // Email is required as an attribute
          },
        },
        allowGuestAccess: false, // Set to true if guest access is needed
        passwordFormat: {
          minLength: 6,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true,
        },
      },
    },
  });

  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is authenticated on component mount
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(); // AWS Cognito sign out
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const [layout, setLayout, undo, redo] = useHistoryState(initializeLayout());
  const [layoutLoading, setLayoutLoading] = useState(true);

  const fetchLayout = async () => {
    try {
      const res = await axios.get(env.VITE_API_GET_JSON, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const layoutData = initializeLayout(res.data.body);
      if (layoutData) {
        for (const newsId of newsIds) {
          if (layoutData[newsId] && layoutData[newsId].id) {
            fetchImageUrl(layoutData[newsId].id, function (response) {
              setLayout((prev) => ({
                ...prev,
                [newsId]: {
                  ...prev[newsId],
                  imageDesc: response,
                  loading: false,
                },
              }));
            });
            layoutData[newsId].loading = true;
          } else {
            layoutData[newsId].loading = false;
          }
        }
      }
      setLayout(layoutData);
    } catch (error) {
      setLayout(initializeLayout());
      console.error("Error fetching data:", error);
    } finally {
      setLayoutLoading(false);
    }
  };
  useEffect(() => {
    fetchLayout();
  }, []);

  // Set Login Page
  // if (!isLoggedIn) {
  //   return <LoginPage onLogin={handleLogin} />;
  // }

  return (
    <Context.Provider value={[layout, setLayout, undo, redo]}>
      <div className="App">
        <AppLayout layoutLoading={layoutLoading} onLogout={handleLogout} />
        <ToastContainer />
      </div>
    </Context.Provider>
  );
};

export default memo(App);

export const blankLayout = {
  header: "NEWSWELL",
  price: "",
  country: "",
  banner: "MASTHEAD",
  date: getFormattedDate(),
  day: getDayOfWeek(),
  issueNumber: "",
  bannerSubtitle: "Your daily source for the latest and greatest in San Diego.",
  qrCode: "24fe4c6a-6f24-4f5f-ba06-41e137cef34b",
  mastheadId: "a49af104-51b4-4ed8-bbe2-7dc9bd430abb",
  mediaAddress: "",
  row1_1: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 108,
    author: "",
    headlineLimit: 0,
    imageSubtitle: "",
    credits: "",
  },
  row1_2: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 108,
    author: "",
    imageSubtitle: "",
    headlineLimit: 0,
    credits: "",
  },
  row1_3: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 108,
    author: "",
    imageSubtitle: "",
    headlineLimit: 0,
    credits: "",
  },
  row2: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 524,
    author: "",
    imageSubtitle: "",
    headlineLimit: 34,
    credits: "",
  },
  row3: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 233,
    author: "",
    headlineLimit: 57,
    imageSubtitle: "",
    credits: "",
  },
  row4: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 144,
    author: "",
    imageSubtitle: "",
    headlineLimit: 57,
    credits: "",
  },
  col1: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 291,
    headlineLimit: 57,
    imageSubtitle: "",
    author: "",
    credits: "",
  },
};

export const initializeLayout = (tLayout) => {
  let layout = structuredClone(tLayout || blankLayout);
  for (const newsId of newsIds) {
    layout = {
      ...layout,
      [newsId]: {
        ...layout[newsId],
        imageDesc: "",
        id: tLayout ? layout[newsId].id : "",
        loading: false,
        credits: "",
      },
    };
  }
  layout = { ...layout, qrCode: tLayout?.qrCode || "24fe4c6a-6f24-4f5f-ba06-41e137cef34b", mastheadId: tLayout?.mastheadId || "a49af104-51b4-4ed8-bbe2-7dc9bd430abb", mediaAddress: tLayout?.mediaAddress || "", selectedTextbox: "" };
  if (layout.qrCode) {
    fetchImageUrl(layout.qrCode, function (response) {
      layout = { ...layout, qrCodeImage: response };
    });
  }
  if (layout.mastheadId) {
    fetchImageUrl(layout.mastheadId, function (response) {
      layout = { ...layout, mastheadId: response };
    });
  }
  return layout;
};
export const cleanLayoutForAPI = (layout) => {
  const cleanedLayout = structuredClone(layout);
  let missingFields = [];
  delete cleanedLayout["qrCodeImage"];
  for (const newsId of newsIds) {
    if (cleanedLayout[newsId]) {
      // Remove imageDesc and loading properties
      delete cleanedLayout[newsId].imageDesc;
      delete cleanedLayout[newsId].loading;
      // Check if 'id' and 'body' fields are present and not empty
      if (!cleanedLayout[newsId].id || !cleanedLayout[newsId].body) {
        missingFields.push(newsId);
      }
      // If the newsId object is empty after removing properties, remove the entire object
      if (Object.keys(cleanedLayout[newsId]).length === 0) {
        delete cleanedLayout[newsId];
      }
    }
  }
  // Remove selectedTextbox property
  delete cleanedLayout.selectedTextbox;

  return { missingFields: missingFields, cleanedLayout: cleanedLayout };
};
export const newsIds = ["row1_1", "row1_2", "row1_3", "row2", "row3", "row4", "col1"];

export const fetchImageUrl = async (id, onSuccess) => {
  try {
    const res = await axios.post(
      env.VITE_API_GET_IMAGE_URL,
      { id },
      {
        mode: "cors",
        headers: {},
      }
    );
    const response = res.data.body;
    if (onSuccess) {
      onSuccess(response);
    }
    return response;
  } catch (error) {
    console.error(`Error fetching image URL for id ${id}:`, error);
    return null;
  }
};
