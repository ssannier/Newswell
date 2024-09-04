import React, { memo, useEffect } from "react";
import AppLayout from "./components/AppLayout"; // Import the main layout component
import "./App.css"; // Import any global styles
import { useState, createContext } from "react";
import axios from "axios";
import { getDayOfWeek, getFormattedDate } from "./components/NewspaperLayout";
export const LayoutContext = createContext();
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useHistoryState from "./useHistoryState";

export const Context = React.createContext();
const env = import.meta.env;

const App = () => {
  const [layout, setLayout, undo, redo] = useHistoryState(initializeLayout());
  const [layoutLoading, setLayoutLoading] = useState(true);

  const fetchImageUrl = async (layoutId, id) => {
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
      setLayout((prev) => ({
        ...prev,
        [layoutId]: {
          ...prev[layoutId],
          imageDesc: response,
          loading: false,
        },
      }));
      return response;
    } catch (error) {
      console.error(`Error fetching image URL for id ${id}:`, error);
      return null;
    }
  };

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
            fetchImageUrl(newsId, layoutData[newsId].id);
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
  price: "$4.50 / 3.20",
  country: "USA / UK",
  banner: "MASTHEAD",
  date: getFormattedDate(),
  day: getDayOfWeek(),
  issueNumber: "77",
  bannerSubtitle: "Your daily source for the latest and greatest in San Diego.",
  row1_1: {
    id: "",
    title: "",
    body: "",
    linkToPage: "5",
    maxLimit: 108,
    author: "",
    headlineLimit: 0,
  },
  row1_2: {
    id: "",
    title: "",
    body: "",
    linkToPage: "5",
    maxLimit: 108,
    author: "",
    headlineLimit: 0,
  },
  row1_3: {
    id: "",
    title: "",
    body: "",
    linkToPage: "5",
    maxLimit: 108,
    author: "",
    headlineLimit: 0,
  },
  row2: {
    id: "",
    title: "",
    body: "",
    linkToPage: "4",
    maxLimit: 524,
    author: "",
    headlineLimit: 34,
  },
  row3: {
    id: "",
    title: "",
    body: "",
    linkToPage: "2",
    maxLimit: 233,
    author: "",
    headlineLimit: 57,
    loading: false,
  },
  row4: {
    id: "",
    title: "",
    body: "",
    linkToPage: "2",
    maxLimit: 144,
    author: "",
    headlineLimit: 57,
  },
  col1: {
    id: "",
    title: "",
    body: "",
    linkToPage: "2",
    maxLimit: 291,
    headlineLimit: 57,
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
        image: "",
        loading: true,
      },
    };
  }
  layout = { ...layout, selectedTextbox: "" };

  return layout;
};
export const cleanLayoutForAPI = (layout) => {
  const cleanedLayout = structuredClone(layout);
  let missingFields = [];

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
