const INDEXED_DB_NAME = 'MiniProject_Javascript';

export class IndexedDB {
    constructor() {
        const dbRequest = window.indexedDB.open(INDEXED_DB_NAME, 1);
        dbRequest.addEventListener('upgradeneeded', this.upgradeNeeded.bind(this));
    }

    upgradeNeeded(event) {
        const db = event.target.result; //database
        db.createObjectStore('Projects', { keyPath: 'id', });
    }

    add(project) {
        return new Promise(function (resolve, reject) {
            var open = window.indexedDB.open(INDEXED_DB_NAME, 1);
            open.onsuccess = function () {
                const db = open.result;
                const transaction = db.transaction("Projects", "readwrite");
                const store = transaction.objectStore("Projects");
                store.add({
                    id: project.id,
                    title: project.title,
                    duration: project.duration,
                    organization: project.organization,
                    address: project.address,
                    section: project.section
                });
                resolve(project);
                db.onerror = function (event) { reject(event) }
                // Close the db when the transaction is done
                transaction.oncomplete = function () {
                    db.close();
                };
                transaction.onerror = function (event) { reject(event) }
            };
            open.onerror = function (event) { reject(event) }
        })
    }

    remove(id) {
        return new Promise(function (resolve, reject) {
            var open = indexedDB.open(INDEXED_DB_NAME, 1);
            open.onsuccess = function () {
                const db = open.result;
                const transaction = db.transaction("Projects", "readwrite");
                const store = transaction.objectStore("Projects");
                const request = store.get(id);
                request.onsuccess = function (event) {
                    resolve(event.target.result);
                    store.delete(id);
                };
                request.onerror = function (event) { reject(event) }
                // Close the db when the transaction is done
                transaction.oncomplete = function () {
                    db.close();
                };
                transaction.onerror = function (event) { reject(event) }
            };
            open.onerror = function (event) { reject(event) }
        })
    }

    retrieveAll() {
        return new Promise(function (resolve, reject) {
            var open = indexedDB.open(INDEXED_DB_NAME, 1);
            open.onsuccess = function () {
                const db = open.result;
                const transaction = db.transaction("Projects", "readwrite");
                const store = transaction.objectStore("Projects");
                const request = store.getAll();
                request.onsuccess = function (event) {
                    resolve(event.target.result);
                };
                request.onerror = function (event) { reject(event) }
                // Close the db when the transaction is done
                transaction.oncomplete = function () {
                    db.close();
                };
                transaction.onerror = function (event) { reject(event) }
            };
            open.onerror = function (event) { reject(event) }
        })
    }

    retrieve(id) {
        return new Promise(function (resolve, reject) {
            var open = indexedDB.open(INDEXED_DB_NAME, 1);
            open.onsuccess = function () {
                const db = open.result;
                const transaction = db.transaction("Projects", "readwrite");
                const store = transaction.objectStore("Projects");
                const request = store.get(id);
                request.onsuccess = function (event) {
                    resolve(event.target.result);
                };
                request.onerror = function (event) { reject(event) }
                // Close the db when the transaction is done
                transaction.oncomplete = function () {
                    db.close();
                };
                transaction.onerror = function (event) { reject(event) }
            };
            open.onerror = function (event) { reject(event) }
        })
    }

    edit(project) {
        return new Promise(function (resolve, reject) {
            var open = indexedDB.open(INDEXED_DB_NAME, 1);
            var id = project.id;
            open.onsuccess = function () {
                const db = open.result;
                const transaction = db.transaction("Projects", "readwrite");
                const store = transaction.objectStore("Projects");
                const request = store.get(project.id);
                request.onsuccess = function (event) {
                    const prj = {
                        id: project.id,
                        title: project.title,
                        duration: project.duration,
                        organization: project.organization,
                        address: project.address,
                        section: project.section
                    }
                    store.delete(id);
                    store.add(prj);
                    resolve(prj);
                };

                request.onerror = function (event) { reject(event) }

                // Close the db when the transaction is done
                transaction.oncomplete = function () {
                    db.close();
                };
                transaction.onerror = function (event) { reject(event) }
            };
            open.onerror = function (event) { reject(event) }
        })
    }
}