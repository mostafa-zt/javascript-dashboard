const GOOGLE_API_KEY = 'AIzaSyBzu4gTGLkYJ3VS2Ab76Z2sBacicBXtSEU';

export async function getAddressFromCoordinates(coords) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_API_KEY}`);
  if (!response.ok) {
    throw new Error('!');
  }
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }
  const address = data.results[0].formatted_address;
  return address;
}

export async function getCoordinatesFromAddress(address) {
  const urlAddress = encodeURI(address);
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`);
  if (!response.ok) {
    throw new Error('It is not possible to load the map on your address. Try again!');
  }
  const data = await response.json();
  if (data.error_message) {
    throw new Error(data.error_message);
  }

  if (data.results.length === 0) {
    throw new Error('It is not possible to load the map on your address. Try again!');
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}
