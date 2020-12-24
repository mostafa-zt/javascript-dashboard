import { DOMHelper } from './Utility.js';
import { Modal } from './Modal.js';
import { Utility } from './Utility.js'
import { IndexedDB } from './IndexedDB.js';
import { Alert, AlertType } from './Alert.js';

export class Section {
    static Open = 'open';
    static Done = 'done';
}

class Project {
    id;
    title;
    duration;
    organization;
    address;
    section;
    constructor(id, title, duration, organization, address, section) {
        this.id = id;
        this.title = title;
        this.duration = duration;
        this.organization = organization;
        this.address = address;
        this.section = section;
    }
}

export class ProjectList extends Project {
    constructor(id, title, duration, organization, address, section) {
        super(id, title, duration, organization, address, section)
    }

    saveProject() {
        const txtTitle = document.getElementById('txt-title');
        const txtDuration = document.getElementById('txt-duration');
        const txtOrganization = document.getElementById('txt-organization');
        const txtaAddress = document.getElementById('txt-address');

        const txtTitleVal = document.getElementById('txt-title').value;
        const txtDuratioVal = document.getElementById('txt-duration').value;
        const txtOrganizationVal = document.getElementById('txt-organization').value;
        const txtaAddressVal = document.getElementById('txt-address').value;

        if (!Utility.isNumeric(txtDuratioVal)) {
            const alert = new Alert(AlertType.Warning, `Duration must be digit only!`);
            alert.show();
            return;
        }
        if (txtTitleVal.trim() === '' || txtDuratioVal.trim() === '' || txtOrganizationVal.trim() === '' || txtaAddressVal.trim() === '') {
            const alert = new Alert(AlertType.Warning, `Please enter requested data!`);
            alert.show();
            return;
        }

        const id = Utility.createGuid()
        const project = new Project(id, txtTitleVal, parseInt(txtDuratioVal), txtOrganizationVal, txtaAddressVal, Section.Open);
        const _indexedDB = new IndexedDB();
        _indexedDB.add(project).then(this.addProject.bind(this))
            .catch(error => {
                const alert = new Alert(AlertType.Warning, 'Adding and saving operation is not fully done, please try again!');
                alert.show();
            });

        new Modal('add-modal-prj').hideModal();

        txtTitle.value = '';
        txtDuration.value = '';
        txtOrganization.value = '';
        txtaAddress.value = '';

        const alert = new Alert(AlertType.Success, `Project has been added and saved in your browser IndexedDB successfully!`);
        alert.show();
    }

    addProject(project) {
        const targetId = project.section === Section.Open ? 'project-open-list' : 'project-done-list'
        const prjNode = document.getElementById(targetId);
        const createdProjectElement = this.renderProject(project);
        prjNode.insertAdjacentElement('afterbegin', createdProjectElement);

        createdProjectElement.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', createdProjectElement.getAttribute('id'));
            event.dataTransfer.effectAllowed = 'move';
        });

        const colseBtn = createdProjectElement.querySelector('.close');
        colseBtn.addEventListener('click', this.removeConfirmation.bind(this, project.id));

        const switchBtn = createdProjectElement.querySelector('.switchBtn-prj');
        switchBtn.addEventListener('click', this.switchProject.bind(this, project.id, project.section === Section.Open ? Section.Open : Section.Done));

        this.updateUI();
    }

    checkSection = (section) => {
        return section === Section.Open ? 'project-open' : 'project-done';
    };

    checkSwitchSection = (section) => {
        return section === Section.Open ? 'project-done' : 'project-open';
    };

    checkSwitchButton = (section) => {
        return section === Section.Open ? 'Return' : 'Done';
    };

    switchProject(id, section) {
        const element = document.getElementById(`${this.checkSection(section)}-${id}`);
        DOMHelper.moveElement(`${this.checkSection(section)}-${id}`, `${this.checkSwitchSection(section)}-list`);
        element.id = `${this.checkSwitchSection(section)}-${id}`;
        const clonedElement = DOMHelper.clearEventListeners(element.querySelector('.switchBtn-prj'));

        const _indexedDB = new IndexedDB();
        _indexedDB.retrieve(id).then(project => {
            const prj = new Project(project.id,
                project.title,
                project.duration,
                project.organization,
                project.address,
                project.section === Section.Open ? Section.Done : Section.Open);
            _indexedDB.edit(prj).then(data => {
                const alert = new Alert(AlertType.Success, `Project has been moved successfully!`);
                alert.show();
            }).catch(error => {
                const alert = new Alert(AlertType.Warning, 'Moving operation is not fully done, please try again!');
                alert.show();
            });
        }).catch(error => {
            const alert = new Alert(AlertType.Warning, 'Moving operation is not fully done, please try again!');
            alert.show();
        });

        const switchTo = section === Section.Open ? Section.Done : Section.Open;
        clonedElement.textContent = this.checkSwitchButton(section);
        clonedElement.addEventListener('click', this.switchProject.bind(this, id, switchTo));
        this.updateUI();
    }

    updateUI() {
        const openProjects = document.querySelectorAll(`#${this.checkSection(Section.Open)} ul li`);
        const doneProjects = document.querySelectorAll(`#${this.checkSection(Section.Done)} ul li`);

        const openProjectSection = document.querySelector(
            '#project-open .empty-project'
        );
        const doneProjectSection = document.querySelector(
            '#project-done .empty-project'
        );

        if (openProjects.length === 0) {
            openProjectSection.classList.remove('invisible');
        } else {
            openProjectSection.classList.add('invisible');
        }

        if (doneProjects.length === 0) {
            doneProjectSection.classList.remove('invisible');
        } else {
            doneProjectSection.classList.add('invisible');
        }
    }

    renderProject(project) {
        const projectItemNode = document.createElement('li');
        projectItemNode.id = project.section === Section.Open ? `project-open-${project.id}` : `project-done-${project.id}`;
        projectItemNode.setAttribute('draggable', 'true');
        projectItemNode.classList.add('fadeIn');

        projectItemNode.innerHTML = `<button title="close" class="close"></button>
                                   <div><span class="title">Title:</span>${project.title}</div>
                                   <div><span class="title">Duration:</span>${project.duration} Days</div>
                                   <div><span class="title">Organization:</span>${project.organization}</div>
                                   <div><span class="title">Address:</span>${project.address}</div>
                                   <div class="actions"><button class="button button-success switchBtn-prj"> ${project.section === Section.Open ? 'Done' : 'Return'} </button></div>`;

        return projectItemNode;
    }

    removeConfirmation(id) {
        const deleteConfirmationModal = new Modal('delete-modal-prj');
        deleteConfirmationModal.setModalFunction(this.remove.bind(this, id));
        deleteConfirmationModal.connectEventListenrs();
        deleteConfirmationModal.showModal().showBackDrop();
    }

    remove(id) {
        const _indexedDB = new IndexedDB();
        _indexedDB.remove(id).then(project => {
            const element = document.getElementById(`${this.checkSection(project.section)}-${project.id}`);
            element.remove();
            new Modal('delete-modal-prj').hideModal();
            const alert = new Alert(AlertType.Success, `Project has been removed successfully!`);
            alert.show();
            this.updateUI();
        }).catch(error => {
            const alert = new Alert(AlertType.Warning, 'Deleting operation is not fully done, please try again!');
            alert.show();
        });
    }

    getAll() {
        const _indexedDB = new IndexedDB();
        _indexedDB.retrieveAll().then(data => {
            const openProjectList = data.filter(item => item.section == Section.Open);
            const doneProjectList = data.filter(item => item.section == Section.Done);
            openProjectList.forEach(item => {
                this.addProject(item)
            })
            doneProjectList.forEach(item => {
                this.addProject(item)
            })
            const alert = new Alert(AlertType.Success, `${data.length} existing projects have been added!`);
            alert.show();
        }).catch(error => {
            const alert = new Alert(AlertType.Warning, 'Loading projects operation is not fully done, please try again!');
            alert.show();
        });
    }

    droppable() {
        const projectBoxes = document.querySelectorAll('.project-box');
        projectBoxes.forEach((box) => {
            box.addEventListener('dragenter', (event) => {
                if (event.dataTransfer.types[0] === 'text/plain') {
                    box.classList.add('droppable');
                    event.preventDefault();
                }
            });
            box.addEventListener('dragover', (event) => {
                if (event.dataTransfer.types[0] === 'text/plain') {
                    event.preventDefault();
                }
            });
            box.addEventListener('dragleave', (event) => {
                if (event.relatedTarget === null || event.relatedTarget.closest('.project-box') !== box) {
                    box.classList.remove('droppable');
                }
            });
            box.addEventListener('drop', (event) => {
                event.preventDefault();
                const prjId = event.dataTransfer.getData('text/plain');
                const targetList = event.target.closest('.project-box');
                let items = [];
                const list = targetList.querySelectorAll('ul li');
                list.forEach((li) => items.push(li.id));
                if (items.find((id) => id === prjId)) {
                    return;
                }
                document.getElementById(prjId).querySelector('.switchBtn-prj').click();
                box.classList.remove('droppable');
            });
        });
    }
}