export async function getData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e, 'error occured at getData()');
  }
}
