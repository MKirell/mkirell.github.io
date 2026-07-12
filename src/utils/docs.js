export function docUrl(filename) {
  return filename
    ? `${import.meta.env.BASE_URL}files/${filename}#view=FitV`
    : null;
}

export function imgUrl(filename) {
  return filename ? `${import.meta.env.BASE_URL}imgs/${filename}` : null;
}
