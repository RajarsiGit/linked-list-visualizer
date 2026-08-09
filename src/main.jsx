import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LinkedListPage from "./features/linked-list/LinkedListPage.jsx";
import StackPage from "./features/stack/StackPage.jsx";
import QueuePage from "./features/queue/QueuePage.jsx";
import BSTPage from "./features/bst/BSTPage.jsx";
import HashTablePage from "./features/hash-table/HashTablePage.jsx";
import HeapPage from "./features/heap/HeapPage.jsx";
import SortingPage from "./features/sorting/SortingPage.jsx";
import GraphPage from "./features/graph/GraphPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="linked-list" element={<LinkedListPage />} />
          <Route path="stack" element={<StackPage />} />
          <Route path="queue" element={<QueuePage />} />
          <Route path="bst" element={<BSTPage />} />
          <Route path="hash-table" element={<HashTablePage />} />
          <Route path="heap" element={<HeapPage />} />
          <Route path="sorting" element={<SortingPage />} />
          <Route path="sorting/:algo" element={<SortingPage />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="graph/:algo" element={<GraphPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
