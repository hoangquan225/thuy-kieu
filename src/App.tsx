import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TemplateOne from './pages/TemplateOne';
import TemplateSecond from './pages/TemplateSecond';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            borderColor: "#000",
            bodySortBg: "#f5f5f5",
            headerBg: "#f5f5f5",
            cellPaddingBlock: 12,
            cellPaddingInline: 12,
          },
        },
      }}
    >
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<TemplateOne />} />
            <Route path="/template-2" element={<TemplateSecond />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ConfigProvider>

  );
}

export default App;
