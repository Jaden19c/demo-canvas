const formatNavigationList = (navigationList: any) => {
  if (!Array.isArray(navigationList)) return [];

  return navigationList.map((item: any) => {
    const { direction } = item;
    return direction;
  });
};

const demo2 = (navigationList: any) => {
  if (!Array.isArray(navigationList)) return [];

  return navigationList.map((item: any) => {
    const { direction, transportation } = item;
    return { direction, transportation };
  });
};

export const formatData = (data: any) => {
  const demo = ["recommendation", "escalator", "elevator"];

  const result: Record<string, any> = {};
  demo.forEach((item) => {
    const { navigationList } = data?.[item] ?? {};

    result[item] = {
      navigationList: demo2(navigationList),
    };
  });

  return result;
};
