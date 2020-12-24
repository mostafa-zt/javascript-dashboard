import { Map } from './Map.js';
import { getCoordinatesFromAddress, getAddressFromCoordinates, } from './Location.js';
import { Alert, AlertType } from './Alert.js'

export class PlaceFinder {
  constructor() {
    const userBtn = document.getElementById('user-location-btn');
    this.userAddressInput = document.getElementById('txt-address');

    this.userAddressInput.addEventListener('focusout', this.findAddressHandler.bind(this));
    userBtn.addEventListener('click', this.locateUserHnadler.bind(this));
  }

  selectPlace(coordinates) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
  }

  locateUserHnadler() {
    if (!navigator.geolocation) {
      const alert = new Alert(AlertType.Warning, `It seems that your browser navigation is off, please turn on it!`);
      alert.show();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (success) => {
        const coordinates = {
          lat: success.coords.latitude,
          lng: success.coords.longitude,
        };
        this.selectPlace(coordinates);
        const address = await getAddressFromCoordinates(coordinates);
        this.userAddressInput.value = address;
      },
      (error) => {
        const alert = new Alert(AlertType.Warning, `It seems that your browser navigation is off, please turn on it!`);
        alert.show();
      }
    );
  }

  async findAddressHandler(event) {
    const address = event.target.value;
    if (!address || address.trim().lenght === 0) {
      const alert = new Alert(AlertType.Warning, `Address is not valid, please enter a valid address!`);
      alert.show();
      return;
    }
    try {
      const coordinates = await getCoordinatesFromAddress(address);
      this.selectPlace(coordinates);
    } catch (error) {
      const alert = new Alert(AlertType.Warning, error);
      alert.show();
    }
  }
}
