export const validateSearchForm = (values) => {
  const errors = {};
  if (!values.key) {
    errors.key = "単語または単語番号を入れてください";
  }
  return errors;
};

export const validateEditVocab = (values) => {
  const errors = {};

  if (!values.en) {
    errors.en = "required";
  }
  const jpFilled =
    values.noun ||
    values.tverb ||
    values.itverb ||
    values.adj ||
    values.adv ||
    values.conn ||
    values.prep;
  if (!jpFilled) {
    errors.noun = "At least one required";
  }

  return errors;
};
