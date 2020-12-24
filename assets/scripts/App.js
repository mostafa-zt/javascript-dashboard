import { Modal } from './Modal.js';
import { PlaceFinder } from './PlaceFinder.js'
import { ProjectList } from './ProjectList.js';

class App {
  static Init() {
    const newPrjBtn = document.getElementById('new-prj');

    const projectList = new ProjectList();
    projectList.droppable();
    projectList.getAll();

    newPrjBtn.addEventListener('click', () => {
      const modal = new Modal('add-modal-prj');
      modal.setModalFunction(projectList.saveProject.bind(projectList));
      modal.connectEventListenrs().showModal().showBackDrop();
    });

    const map = new PlaceFinder();
  }
}

App.Init();
