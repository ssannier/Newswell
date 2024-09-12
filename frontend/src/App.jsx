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

export const Context = React.createContext();
const env = import.meta.env;

const App = () => {
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

  return (
    <Context.Provider value={[layout, setLayout, undo, redo]}>
      <div className="App">
        <AppLayout layoutLoading={layoutLoading} />
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
  qrCode: "794d57ee-4dbf-4321-a5ea-b2fbecb5675c",
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
      },
    };
  }
  layout = { ...layout, qrCode: tLayout?.qrCode || "794d57ee-4dbf-4321-a5ea-b2fbecb5675c", mediaAddress: tLayout?.mediaAddress || "", selectedTextbox: "" };
  if (layout.qrCode) {
    fetchImageUrl(layout.qrCode, function (response) {
      layout = { ...layout, qrCodeImage: response };
    });
  }
  return layout;
};
export const cleanLayoutForAPI = (layout) => {
  // debugger;
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
