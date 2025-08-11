"use client";
import React, { useState, useMemo, ReactNode } from "react";
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
  priority: "High" | "Medium" | "Low";
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
      strokeWidth="2"
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
      strokeWidth="2"
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
      strokeWidth="2"
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
      strokeWidth="2"
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
      strokeWidth="2"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);
const GlobeAltIcon = ({ className = "w-6 h-6" }) => (
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
      strokeWidth="2"
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9"
    />
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
      strokeWidth="2"
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
      strokeWidth="2"
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
  isCollapsed,
  onToggleSidebar,
}: {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}) => {
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, active: false },
    { name: "Incoming Documents", icon: DocumentDuplicateIcon, active: true },
    { name: "Categories", icon: FolderIcon, active: false },
  ];
  return (
    <aside
      className={`bg-indigo-800 text-white flex-col flex-shrink-0 transition-all duration-300 ease-in-out lg:flex ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between bg-indigo-900 flex-shrink-0 px-4">
        <Image
          src={`https://placehold.co/120x40/6366F1/FFFFFF?text=LOGO&font=lato`}
          alt="Logo"
          width={120}
          height={40}
          className={`transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        />
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
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

const TopHeader = () => (
  <header className="bg-white shadow-sm w-full flex-shrink-0">
    <div className="flex items-center justify-end h-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
          <SearchIcon className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
          <GlobeAltIcon />
        </button>
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
          <BellIcon />
        </button>
        <div className="flex items-center space-x-2">
          <Image
            className="h-8 w-8 rounded-full object-cover"
            src="https://placehold.co/40x40/EFEFEF/4A4A4A?text=A"
            alt="User avatar"
            width={40}
            height={40}
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Admin User
          </span>
        </div>
      </div>
    </div>
  </header>
);

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
      className={`appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 ${
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
        <span>{children}</span>
        <SortIcon className="text-indigo-300" direction={direction} />
      </div>
    </th>
  );
};

// --- Mock Data ---
const mockDocuments: Document[] = [
  {
    id: 1,
    orderNumber: 1001,
    title: "Q1 Financial Report",
    category: "Finance",
    subcategory: "Reports",
    status: "Completed",
    destination: "Alice",
    createdAt: "2023-01-15",
    updatedAt: "2023-01-20",
    priority: "High",
  },
  {
    id: 2,
    orderNumber: 1002,
    title: "Marketing Campaign Proposal",
    category: "Marketing",
    subcategory: "Proposals",
    status: "Pending",
    destination: "Bob",
    createdAt: "2023-02-01",
    updatedAt: "2023-02-01",
    priority: "Medium",
  },
  {
    id: 3,
    orderNumber: 1003,
    title: "HR Policy Update",
    category: "HR",
    subcategory: "Policies",
    status: "Processing",
    destination: "Charlie",
    createdAt: "2023-02-10",
    updatedAt: "2023-02-12",
    priority: "High",
  },
  {
    id: 4,
    orderNumber: 1004,
    title: "IT Security Audit",
    category: "IT",
    subcategory: "Audits",
    status: "Completed",
    destination: "David",
    createdAt: "2023-03-05",
    updatedAt: "2023-03-10",
    priority: "Low",
  },
  {
    id: 5,
    orderNumber: 1005,
    title: "Product Roadmap Q3",
    category: "Product",
    subcategory: "Roadmaps",
    status: "Pending",
    destination: "Eve",
    createdAt: "2023-03-20",
    updatedAt: "2023-03-20",
    priority: "Medium",
  },
  {
    id: 6,
    orderNumber: 1006,
    title: "Annual General Meeting Minutes",
    category: "Finance",
    subcategory: "Minutes",
    status: "Processing",
    destination: "Frank",
    createdAt: "2023-04-01",
    updatedAt: "2023-04-02",
    priority: "High",
  },
  {
    id: 7,
    orderNumber: 1007,
    title: "New Hire Onboarding Docs",
    category: "HR",
    subcategory: "Onboarding",
    status: "Completed",
    destination: "Grace",
    createdAt: "2023-04-15",
    updatedAt: "2023-04-18",
    priority: "Low",
  },
  {
    id: 8,
    orderNumber: 1008,
    title: "Website Redesign Mockups",
    category: "Marketing",
    subcategory: "Designs",
    status: "Pending",
    destination: "Heidi",
    createdAt: "2023-05-01",
    updatedAt: "2023-05-01",
    priority: "Medium",
  },
  {
    id: 9,
    orderNumber: 1009,
    title: "Server Maintenance Plan",
    category: "IT",
    subcategory: "Audits",
    status: "Pending",
    destination: "David",
    createdAt: "2023-05-10",
    updatedAt: "2023-05-10",
    priority: "High",
  },
  {
    id: 10,
    orderNumber: 1010,
    title: "Q2 Sales Report",
    category: "Finance",
    subcategory: "Reports",
    status: "Completed",
    destination: "Alice",
    createdAt: "2023-06-01",
    updatedAt: "2023-06-05",
    priority: "Low",
  },
];

const categories: Option[] = [
  { value: "Finance", label: "Finance" },
  { value: "Marketing", label: "Marketing" },
  { value: "HR", label: "Human Resources" },
  { value: "IT", label: "Information Technology" },
  { value: "Product", label: "Product Management" },
];
const subcategories: { [key: string]: Option[] } = {
  Finance: [
    { value: "Reports", label: "Reports" },
    { value: "Minutes", label: "Minutes" },
  ],
  Marketing: [
    { value: "Proposals", label: "Proposals" },
    { value: "Designs", label: "Designs" },
  ],
  HR: [
    { value: "Policies", label: "Policies" },
    { value: "Onboarding", label: "Onboarding" },
  ],
  IT: [{ value: "Audits", label: "Audits" }],
  Product: [{ value: "Roadmaps", label: "Roadmaps" }],
};
const statuses: Option[] = [
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Completed", label: "Completed" },
];
const destinations: Option[] = [
  { value: "Alice", label: "Alice" },
  { value: "Bob", label: "Bob" },
  { value: "Charlie", label: "Charlie" },
  { value: "David", label: "David" },
  { value: "Eve", label: "Eve" },
  { value: "Frank", label: "Frank" },
  { value: "Grace", label: "Grace" },
  { value: "Heidi", label: "Heidi" },
];
const priorities: Option[] = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];
const priorityColorMap: { [key: string]: string } = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-gray-100 text-gray-800",
};

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
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <header className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Incoming Documents
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Home / Documents / Search
                </p>
              </div>
            </header>

            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label
                    htmlFor="keywords"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Keywords
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="keywords"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="Type to filter..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <CustomSelect
                    options={categories}
                    value={category}
                    onChange={handleCategoryChange}
                    placeholder="All"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subcategory
                  </label>
                  <CustomSelect
                    options={subcategories[category] || []}
                    value={subcategory}
                    onChange={setSubcategory}
                    placeholder="Select Category First"
                    disabled={!category}
                  />
                </div>
                <div>
                  <label
                    htmlFor="destination"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Destination
                  </label>
                  <CustomSelect
                    options={destinations}
                    value={destination}
                    onChange={setDestination}
                    placeholder="All"
                  />
                </div>
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Priority
                  </label>
                  <CustomSelect
                    options={priorities}
                    value={priority}
                    onChange={setPriority}
                    placeholder="All"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <CustomSelect
                    options={statuses}
                    value={status}
                    onChange={setStatus}
                    placeholder="All"
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
                        Document Title
                      </SortableHeader>
                      <SortableHeader
                        sortKey="priority"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        Priority
                      </SortableHeader>
                      <SortableHeader
                        sortKey="createdAt"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        Created
                      </SortableHeader>
                      <SortableHeader
                        sortKey="updatedAt"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        Updated
                      </SortableHeader>
                      <SortableHeader
                        sortKey="destination"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        Destination
                      </SortableHeader>
                      <SortableHeader
                        sortKey="status"
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                      >
                        Status
                      </SortableHeader>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Actions
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
                              className="text-indigo-600 hover:text-indigo-900 hover:underline"
                            >
                              {doc.title}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                priorityColorMap[doc.priority]
                              }`}
                            >
                              {doc.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.updatedAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.destination}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                doc.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : doc.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {doc.status}
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
                          className="text-center py-10 text-gray-500"
                        >
                          No documents match your search criteria.
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
