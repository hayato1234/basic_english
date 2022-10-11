export const validateSearchForm = (values) => {
  const errors = {};
  if (!values.key) {
    errors.key = "単語または単語番号を入れてください";
  }
  return errors;
};
