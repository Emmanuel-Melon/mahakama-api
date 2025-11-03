export const calculatePaginationOffset = (options: any) => {
  const { page, limit } = options;
  const offset = (page - 1) * limit;
  return offset;
};

export const calculatePageInfo = (results: any, options: any) => {
  const { page, limit } = options;
  const total = Number(results[0]?.count || 0);
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    totalPages,
  };
};
