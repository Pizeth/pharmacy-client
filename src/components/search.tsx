"use client";
import React, { useState, useMemo, ReactNode, useEffect } from "react";
import Image from "next/image";

// --- Type Definitions ---
type SortDirection = "ascending" | "descending" | "none";

interface SortConfig {
  key: keyof Document;
  direction: SortDirection;
}

interface Document {
  id: number;
  orderNumber: number;
  title: string;
  category: string;
  subcategory: string;
  status: "Pending" | "Processing" | "Completed";
  destination: string;
  createdAt: string;
  updatedAt: string;
  priority: "Very Urgent" | "Urgent" | "Normal";
}

interface Option {
  value: string;
  label: string;
}

// --- Icon Components ---
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);
const EditIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);
const DeleteIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const HomeIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const DocumentDuplicateIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);
const FolderIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);
const I18nIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path>
  </svg>
);
const BellIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);
const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const SortIcon = ({
  className = "",
  direction,
}: {
  className?: string;
  direction: SortDirection;
}) => {
  const classNames = `w-4 h-4 transition-transform duration-200 ${
    direction === "ascending" ? "transform -rotate-180" : ""
  } ${direction === "none" ? "opacity-30" : "opacity-100"}`;
  return (
    <svg
      className={`${classNames} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 01.53.22l3.25 3.25a.75.75 0 11-1.06 1.06L10 4.81V16.25a.75.75 0 01-1.5 0V4.81L5.78 7.53a.75.75 0 01-1.06-1.06l3.25-3.25A.75.75 0 0110 3z"
        clipRule="evenodd"
      />
    </svg>
  );
};

// --- Helper Components ---

const Sidebar = ({
  isOpen,
  isCollapsed,
}: {
  isOpen: boolean;
  isCollapsed: boolean;
}) => {
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, active: false },
    { name: "Incoming Documents", icon: DocumentDuplicateIcon, active: true },
    { name: "Categories", icon: FolderIcon, active: false },
  ];
  const sidebarClasses = `
        bg-indigo-800 text-white flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
        fixed lg:relative inset-y-0 left-0 z-40
        ${isCollapsed ? "w-20" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
    `;
  return (
    <aside className={sidebarClasses}>
      <div className="h-16 flex items-center justify-center bg-indigo-900 flex-shrink-0 px-4">
        <div
          className={`w-10 h-10 rounded-full overflow-hidden bg-indigo-700 flex items-center justify-center`}
        >
          <Image
            src={`/logo.png`}
            alt="Logo"
            width={150}
            height={150}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a
                href="#"
                title={item.name}
                className={`flex items-center gap-3 py-3 rounded-lg transition-colors ${
                  isCollapsed ? "justify-center px-2" : "px-4"
                } ${
                  item.active
                    ? "bg-indigo-700 font-semibold"
                    : "hover:bg-indigo-700"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`whitespace-nowrap ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const TopHeader = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  return (
    <header className="bg-white shadow-sm w-full flex-shrink-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center transition-all duration-300 ease-in-out ${
              isSearchExpanded ? "w-48" : "w-0"
            }`}
          >
            <input
              type="text"
              className={`w-full bg-gray-100 rounded-full px-4 py-1.5 transition-opacity duration-300 ${
                isSearchExpanded ? "opacity-100" : "opacity-0"
              }`}
              placeholder="Global Search..."
            />
          </div>
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            <SearchIcon className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
            <I18nIcon />
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
            <BellIcon />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                src="/logo.png"
                alt="User avatar"
                width={40}
                height={40}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Admin User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: CustomSelectProps) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`font-khmer appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((option: Option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <ChevronDownIcon />
    </div>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="py-4 flex justify-between items-center flex-wrap gap-2">
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
              currentPage === number
                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

interface SortableHeaderProps {
  children: ReactNode;
  sortKey: keyof Document;
  sortConfig: SortConfig;
  requestSort: (key: keyof Document) => void;
}

const SortableHeader = ({
  children,
  sortKey,
  sortConfig,
  requestSort,
}: SortableHeaderProps) => {
  const isSorted = sortConfig.key === sortKey;
  const direction = isSorted ? sortConfig.direction : "none";

  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer group"
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        <span className="font-khmer">{children}</span>
        <SortIcon className="text-indigo-300" direction={direction} />
      </div>
    </th>
  );
};

// --- Mock Data ---
const categories: Option[] = [
  { value: "Authorization", label: "មុខការ" },
  { value: "Notification", label: "ជូនជ្រាប" },
  { value: "Invitation", label: "លិខិតអញ្ជើញ" },
  { value: "Others", label: "ផ្សេងៗ" },
];
const subcategories: { [key: string]: Option[] } = {
  Authorization: [
    { value: "Proposals", label: "សំណើ" },
    { value: "Promotion", label: "ការតែងតាំង" },
    { value: "Policies", label: "គោលនយោបាយ" },
    { value: "Audits", label: "សវនកម្ម" },
  ],
  Notification: [
    { value: "Reports", label: "របាយការណ៍" },
    { value: "Minutes", label: "កំណត់ហេតុ" },
  ],
  Invitation: [
    { value: "Invitation", label: "លិខិតអញ្ជើញក្រុមការងារចុះមូលដ្ឋាន" },
    { value: "Inter Ministry", label: "លិខិតអញ្ជើញអន្តរក្រសួង" },
  ],
  Others: [{ value: "Greeting", label: "លិខិតជូនពរ" }],
};
const statuses: Option[] = [
  { value: "Pending", label: "កំពុងរង់ចាំ" },
  { value: "Processing", label: "កំពុងដំណើរការ" },
  { value: "Completed", label: "រួចរាល់" },
];
const destinations: Option[] = [
  {
    value: "Minister",
    label: "ឯកឧត្តមឧបនាយករដ្ឋមន្រ្តី រដ្ឋមន្រ្តីក្រសួងមុខងារសាធារណៈ",
  },
  {
    value: "Permannent Secretary of State",
    label: "ឯកឧត្តមរដ្ឋលេខាធិការប្រចាំការ",
  },
  { value: "Minister's Cabinet", label: "ខុទ្ទកាល័យ" },
  { value: "អ.កមស", label: "អ.កមស" },
  { value: "អ.មស", label: "អ.មស" },
  { value: "អ.គម", label: "អ.គម" },
  { value: "G.Inspection", label: "អគ្គាធិការដ្ឋាន" },
  { value: "D.Audit", label: "ន.សវក" },
  { value: "D.Administration", label: "ន.រដ្ឋបាល" },
  { value: "អង្គភាពលទ្ធកម្ម", label: "អង្គភាពលទ្ធកម្ម" },
];
const priorities: Option[] = [
  { value: "Very Urgent", label: "ប្រញ៉ាប់ណាស់" },
  { value: "Urgent", label: "ប្រញ៉ាប់" },
  { value: "Normal", label: "ធម្មតា" },
];

const priorityColorMap: { [key: string]: string } = {
  "Very Urgent": "bg-red-100 text-red-800",
  Urgent: "bg-yellow-100 text-yellow-800",
  Normal: "bg-gray-100 text-gray-800",
};

const mockDocuments: Document[] = [
  {
    id: 1,
    orderNumber: 1001,
    title: "សំណើសុំតែងតាំងមន្ត្រី",
    category: "Authorization",
    subcategory: "Promotion",
    status: "Completed",
    destination: "Minister",
    createdAt: "2023-01-15",
    updatedAt: "2023-01-20",
    priority: "Very Urgent",
  },
  {
    id: 2,
    orderNumber: 1002,
    title: "របាយការណ៍ប្រចាំខែ",
    category: "Notification",
    subcategory: "Reports",
    status: "Pending",
    destination: "Permannent Secretary of State",
    createdAt: "2023-02-01",
    updatedAt: "2023-02-01",
    priority: "Normal",
  },
  {
    id: 3,
    orderNumber: 1003,
    title: "លិខិតអញ្ជើញប្រជុំអន្តរក្រសួង",
    category: "Invitation",
    subcategory: "Inter Ministry",
    status: "Processing",
    destination: "Minister's Cabinet",
    createdAt: "2023-02-10",
    updatedAt: "2023-02-12",
    priority: "Urgent",
  },
  {
    id: 4,
    orderNumber: 1004,
    title: "សវនកម្មផ្ទៃក្នុង",
    category: "Authorization",
    subcategory: "Audits",
    status: "Completed",
    destination: "G.Inspection",
    createdAt: "2023-03-05",
    updatedAt: "2023-03-10",
    priority: "Normal",
  },
  {
    id: 5,
    orderNumber: 1005,
    title: "លិខិតជូនពរក្នុងឱកាសចូលឆ្នាំថ្មី",
    category: "Others",
    subcategory: "Greeting",
    status: "Pending",
    destination: "Minister",
    createdAt: "2023-03-20",
    updatedAt: "2023-03-20",
    priority: "Normal",
  },
  {
    id: 6,
    orderNumber: 1006,
    title: "កំណត់ហេតុកិច្ចប្រជុំ",
    category: "Notification",
    subcategory: "Minutes",
    status: "Processing",
    destination: "អ.កមស",
    createdAt: "2023-04-01",
    updatedAt: "2023-04-02",
    priority: "Urgent",
  },
  {
    id: 7,
    orderNumber: 1007,
    title: "គោលនយោបាយថ្មីស្តីពីការគ្រប់គ្រងបុគ្គលិក",
    category: "Authorization",
    subcategory: "Policies",
    status: "Completed",
    destination: "អ.មស",
    createdAt: "2023-04-15",
    updatedAt: "2023-04-18",
    priority: "Normal",
  },
  {
    id: 8,
    orderNumber: 1008,
    title: "លិខិតអញ្ជើញក្រុមការងារចុះមូលដ្ឋាន",
    category: "Invitation",
    subcategory: "Invitation",
    status: "Pending",
    destination: "D.Administration",
    createdAt: "2023-05-01",
    updatedAt: "2023-05-01",
    priority: "Urgent",
  },
  {
    id: 9,
    orderNumber: 1009,
    title: "សំណើសុំปรับปรุงប្រព័ន្ធ",
    category: "Authorization",
    subcategory: "Proposals",
    status: "Pending",
    destination: "អ.គម",
    createdAt: "2023-05-10",
    updatedAt: "2023-05-10",
    priority: "Very Urgent",
  },
  {
    id: 10,
    orderNumber: 1010,
    title: "របាយការណ៍ត្រីមាសទី២",
    category: "Notification",
    subcategory: "Reports",
    status: "Completed",
    destination: "Permannent Secretary of State",
    createdAt: "2023-06-01",
    updatedAt: "2023-06-05",
    priority: "Normal",
  },
  {
    id: 11,
    orderNumber: 1011,
    title: "សំណើសុំจัดซื้ออุปกรณ์",
    category: "Authorization",
    subcategory: "Proposals",
    status: "Pending",
    destination: "អង្គភាពលទ្ធកម្ម",
    createdAt: "2023-06-10",
    updatedAt: "2023-06-11",
    priority: "Urgent",
  },
  {
    id: 12,
    orderNumber: 1012,
    title: "លិខិតអញ្ជើញចូលរួមពិធីសម្ពោធ",
    category: "Invitation",
    subcategory: "Inter Ministry",
    status: "Processing",
    destination: "Minister's Cabinet",
    createdAt: "2023-06-15",
    updatedAt: "2023-06-20",
    priority: "Urgent",
  },
  {
    id: 13,
    orderNumber: 1013,
    title: "ការតែងតាំងប្រធាននាយកដ្ឋាន",
    category: "Authorization",
    subcategory: "Promotion",
    status: "Pending",
    destination: "Minister",
    createdAt: "2023-07-01",
    updatedAt: "2023-07-01",
    priority: "Very Urgent",
  },
  {
    id: 14,
    orderNumber: 1014,
    title: "លិខិតជូនពរថ្ងៃខួបកំណើត",
    category: "Others",
    subcategory: "Greeting",
    status: "Completed",
    destination: "Permannent Secretary of State",
    createdAt: "2023-07-05",
    updatedAt: "2023-07-10",
    priority: "Normal",
  },
  {
    id: 15,
    orderNumber: 1015,
    title: "សំណើសុំงบประมาณปี 2024",
    category: "Authorization",
    subcategory: "Proposals",
    status: "Pending",
    destination: "Minister",
    createdAt: "2023-07-12",
    updatedAt: "2023-07-12",
    priority: "Very Urgent",
  },
  {
    id: 16,
    orderNumber: 1016,
    title: "របាយការណ៍បេសកកម្ម",
    category: "Notification",
    subcategory: "Reports",
    status: "Processing",
    destination: "អ.កមស",
    createdAt: "2023-07-20",
    updatedAt: "2023-07-22",
    priority: "Urgent",
  },
  {
    id: 17,
    orderNumber: 1017,
    title: "គោលនយោបាយស្តីពីការប្រើប្រាស់អ៊ីនធឺណិត",
    category: "Authorization",
    subcategory: "Policies",
    status: "Completed",
    destination: "អ.មស",
    createdAt: "2023-08-01",
    updatedAt: "2023-08-05",
    priority: "Normal",
  },
  {
    id: 18,
    orderNumber: 1018,
    title: "សវនកម្មប្រចាំឆ្នាំ",
    category: "Authorization",
    subcategory: "Audits",
    status: "Pending",
    destination: "G.Inspection",
    createdAt: "2023-08-10",
    updatedAt: "2023-08-10",
    priority: "Very Urgent",
  },
  {
    id: 19,
    orderNumber: 1019,
    title: "កំណត់ហេតុកិច្ចប្រជុំក្រុមប្រឹក្សា",
    category: "Notification",
    subcategory: "Minutes",
    status: "Processing",
    destination: "Minister's Cabinet",
    createdAt: "2023-08-15",
    updatedAt: "2023-08-18",
    priority: "Urgent",
  },
  {
    id: 20,
    orderNumber: 1020,
    title: "លិខិតអញ្ជើញចូលរួមសិក្ខាសាលា",
    category: "Invitation",
    subcategory: "Invitation",
    status: "Completed",
    destination: "D.Administration",
    createdAt: "2023-09-01",
    updatedAt: "2023-09-05",
    priority: "Normal",
  },
];

// --- Main Search Component ---
export default function AdvancedSearchPage() {
  // State for filters
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [destination, setDestination] = useState("");
  const [priority, setPriority] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "orderNumber",
    direction: "ascending",
  });

  // State for sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setDesktopCollapsed(!isDesktopCollapsed);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory("");
  };

  const requestSort = (key: keyof Document) => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredDocuments = useMemo(() => {
    let sortableItems = [...mockDocuments];

    // Filtering
    sortableItems = sortableItems.filter((doc) => {
      const keywordMatch =
        keywords.trim() === "" ||
        doc.title.toLowerCase().includes(keywords.toLowerCase());
      const categoryMatch = category === "" || doc.category === category;
      const subcategoryMatch =
        subcategory === "" || doc.subcategory === subcategory;
      const statusMatch = status === "" || doc.status === status;
      const destinationMatch =
        destination === "" || doc.destination === destination;
      const priorityMatch = priority === "" || doc.priority === priority;
      return (
        keywordMatch &&
        categoryMatch &&
        subcategoryMatch &&
        statusMatch &&
        destinationMatch &&
        priorityMatch
      );
    });

    // Sorting
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === "string" && typeof valB === "string") {
          return sortConfig.direction === "ascending"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        if (valA < valB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [
    keywords,
    category,
    subcategory,
    status,
    destination,
    priority,
    sortConfig,
  ]);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [keywords, category, subcategory, status, destination, priority]);

  // Pagination calculations
  const totalPages = Math.ceil(
    sortedAndFilteredDocuments.length / itemsPerPage
  );
  const paginatedDocuments = sortedAndFilteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Siemreap&display=swap');
            .font-khmer {
                font-family: 'Siemreap', sans-serif;
            }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <Sidebar
        isOpen={
          isSidebarOpen ||
          (typeof window !== "undefined" && window.innerWidth >= 1024)
        }
        isCollapsed={isDesktopCollapsed}
      />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <header className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 font-khmer">
                  ឯកសារចូល
                </h1>
                <p className="text-sm text-gray-500 mt-1 font-khmer">
                  ទំព័រដើម / ឯកសារ / ស្វែងរក
                </p>
              </div>
            </header>

            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
                  <label
                    htmlFor="keywords"
                    className="block text-sm font-medium text-gray-700 mb-1 font-khmer"
                  >
                    ពាក្យគន្លឹះ
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      id="keywords"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="ស្វែងរក..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 font-khmer text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1 font-khmer"
                  >
                    ប្រភេទ
                  </label>
                  <CustomSelect
                    options={categories}
                    value={category}
                    onChange={handleCategoryChange}
                    placeholder="ទាំងអស់"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium text-gray-700 mb-1 font-khmer"
                  >
                    ប្រភេទរង
                  </label>
                  <CustomSelect
                    options={subcategories[category] || []}
                    value={subcategory}
                    onChange={setSubcategory}
                    placeholder="ជ្រើសរើសប្រភេទ"
                    disabled={!category}
                  />
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700 mb-1 font-khmer"
                  >
                    គោលដៅ
                  </label>
                  <CustomSelect
                    options={destinations}
                    value={destination}
                    onChange={setDestination}
                    placeholder="ទាំងអស់"
                  />
                </div>
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700 mb-1 font-khmer"
                  >
                    អាទិភាព
                  </label>
                  <CustomSelect
                    options={priorities}
                    value={priority}
                    onChange={setPriority}
                    placeholder="ទាំងអស់"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1 font-khmer"
                  >
                    ស្ថានភាព
                  </label>
                  <CustomSelect
                    options={statuses}
                    value={status}
                    onChange={setStatus}
                    placeholder="ទាំងអស់"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-700">
                    <tr>
                      <SortableHeader
                        sortKey="orderNumber"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        №
                      </SortableHeader>
                      <SortableHeader
                        sortKey="title"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        ចំណងជើងឯកសារ
                      </SortableHeader>
                      <SortableHeader
                        sortKey="priority"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        អាទិភាព
                      </SortableHeader>
                      <SortableHeader
                        sortKey="createdAt"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        បង្កើតនៅ
                      </SortableHeader>
                      <SortableHeader
                        sortKey="updatedAt"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        កែប្រែនៅ
                      </SortableHeader>
                      <SortableHeader
                        sortKey="destination"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        គោលដៅ
                      </SortableHeader>
                      <SortableHeader
                        sortKey="status"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        ស្ថានភាព
                      </SortableHeader>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider font-khmer"
                      >
                        សកម្មភាព
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedDocuments.length > 0 ? (
                      paginatedDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a
                              href={`/docs/${doc.id}`}
                              className="text-indigo-600 hover:text-indigo-900 hover:underline font-khmer"
                            >
                              {doc.title}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`font-khmer px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                priorityColorMap[doc.priority]
                              }`}
                            >
                              {
                                priorities.find((p) => p.value === doc.priority)
                                  ?.label
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.updatedAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-khmer">
                            {
                              destinations.find(
                                (d) => d.value === doc.destination
                              )?.label
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`font-khmer px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                doc.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : doc.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {
                                statuses.find((s) => s.value === doc.status)
                                  ?.label
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <div className="flex items-center justify-center gap-x-4">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <EditIcon />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <DeleteIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-10 text-gray-500 font-khmer"
                        >
                          មិនមានឯកសារដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរករបស់អ្នកទេ។
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
