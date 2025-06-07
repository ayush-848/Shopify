export const getTabStyle = (tab, activeTab) => {
  return `flex-1 py-3 text-center font-semibold cursor-pointer transition-all duration-200 ${
    activeTab === tab
      ? 'bg-white text-blue-700 border-b-2 border-blue-500'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }`;
};

export const getRadioStyle = (type, current) => {
  return `relative inline-flex items-center justify-center flex-1 px-3 py-2 cursor-pointer ${
    type === current
      ? 'bg-blue-600 text-white font-medium'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  } transition-all duration-200 first:rounded-l-md last:rounded-r-md`;
};