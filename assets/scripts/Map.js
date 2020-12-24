import { getAddressFromCoordinates } from './Location.js';
import { Alert, AlertType } from './Alert.js'

export class Map {
  constructor(coordinates) {
    // this.coordinates = coords;
    this.render(coordinates);
  }

  render(coordinates) {
    if (!google) {
      const alert = new Alert(AlertType.Warning, `Map was not loaded successfully, there is something wrong! please try again!`);
      alert.show();
      return;
    }
    const map = new google.maps.Map(document.getElementById('map'), {
      center: coordinates,
      zoom: 16,
    });
    const marker = new google.maps.Marker({
      position: coordinates,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    marker.addListener('mouseup', async () => {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      const position = marker.getPosition();
      map.setCenter(position);
      const latitude = position.lat();
      const longitude = position.lng();
      const coords = { lat: latitude, lng: longitude };
      const address = await getAddressFromCoordinates(coords);
      const addressInput = document.getElementById('txt-address');
      addressInput.value = address;
    });
  }
}
