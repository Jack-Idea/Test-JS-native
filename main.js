document.addEventListener('DOMContentLoaded', () => {

    let students = [
        {
            name: 'Анна',
            surname: 'Керекелица',
            middleName: 'Владимировна',
            date: new Date('1991-06-14'),
            startDate: '2011',
            faculty: 'Финансы и кредит'
        },
        {
            name: 'Герман',
            surname: 'Макаренко',
            middleName: 'Артурович',
            date: new Date('1988-06-16'),
            startDate: '2008',
            faculty: 'Юриспруденция'
        },
    ];

    const tableHeaders = ['ФИО студента', 'Факультет', 'Дата рождения', 'Годы обучения(курс)'];

    let today = new Date();//сегодняшняя дата
    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1;

    const container = document.createElement('div');
    container.classList.add('container');
    document.body.append(container);



    let filterDiv = document.createElement('div');
    filterDiv.classList.add('filter')
    container.prepend(filterDiv);

    let searchName = document.createElement('input');
    searchName.placeholder = 'Поиск по ФИО';

    let searchFaculty = document.createElement('input');
    searchFaculty.placeholder = 'Поиск по факультету';

    let searchStartDate = document.createElement('input');
    searchStartDate.placeholder = 'Поиск по году начала обучения';

    let searchEndDate = document.createElement('input');
    searchEndDate.placeholder = 'Поиск по году окончания обучения';

    filterDiv.append(searchName, searchFaculty, searchStartDate, searchEndDate);

    function createTable() {

        let table = document.createElement('table');
        table.classList.add('table', 'table-bordered', 'border-primary');
        container.append(table);

        let tableHead = document.createElement('thead');
        table.append(tableHead);

        let tableRow = document.createElement('tr');
        tableHead.append(tableRow);

        let tableBody = document.createElement('tbody');
        table.append(tableBody);


        for (header of tableHeaders) {
            let tableHeaderCell = document.createElement('th');
            tableHeaderCell.textContent = header;
            tableRow.append(tableHeaderCell);
        }

        let headerBtns = document.getElementsByTagName('th');


        function tableFilter(column) {
            let sortedRows = Array.from(table.rows)
                .slice(1)
                .sort((rowA, rowB) => rowA.cells[column].innerHTML > rowB.cells[column].innerHTML ? 1 : -1)

            table.tBodies[0].append(...sortedRows);
        }

        headerBtns[0].addEventListener('click', () => tableFilter(0));
        headerBtns[1].addEventListener('click', () => tableFilter(1));
        headerBtns[2].addEventListener('click', () => tableFilter(2));
        headerBtns[3].addEventListener('click', () => tableFilter(3));


        function calcCurrentLearningCourse() {
            currentYear = Number(currentYear);
            currentMonth = Number(currentMonth);

            students.map((student) => {
                let currentCourse = currentYear - student.startDate;

                student.endLearningDate = Number(student.startDate) + 4;
                if (currentCourse === 4 && currentMonth > 9 || currentCourse > 4) {
                    student.currentLearningCourse = 'Закончил';
                }
                else if (currentMonth > 9) {
                    student.currentLearningCourse = currentCourse + 1;
                }
                else if (student.startDate !== 'Закончил') {
                    student.currentLearningCourse = currentCourse;
                };
            });
        }

        calcCurrentLearningCourse();


        for (student of students) {
            let tableBodyRow = document.createElement('tr');
            tableBody.append(tableBodyRow);

            let tdFullName = document.createElement('td');
            tdFullName.textContent = student.surname + ' ' + student.name + ' ' + student.middleName;
            tdFullName.classList.add('fullname');
            tableBodyRow.append(tdFullName);

            let tdFaculty = document.createElement('td');
            tdFaculty.textContent = student.faculty;
            tableBodyRow.append(tdFaculty);

            let birthdate = student.date;//дата рождения студента
            let diff = today - birthdate; //разница в миллисекундах
            let age = Math.floor(diff / 31557600000);

            let tdBirthday = document.createElement('td');
            tdBirthday.textContent = student.date.toLocaleDateString() + '(' + age + ')';
            tableBodyRow.append(tdBirthday);


            let tdYearsOfEducation = document.createElement('td');
            tableBodyRow.append(tdYearsOfEducation);

            tdYearsOfEducation.textContent = student.startDate + ' - ' + student.endLearningDate + ' (' + student.currentLearningCourse + ')';
        }

        //FILTER
        let defaultRows = Array.from(table.rows).splice(1);

        const result = document.getElementsByTagName('tbody')[0];

        renderList(defaultRows, result);

        function filter(val, list, index, date) {
            let result = [];
            list.forEach(i => {
                if (date === 'start') {
                    let splitYear = i.cells[index].innerText.split(' ')[0];
                    if (splitYear.indexOf(val)!=-1) {
                        result.push(i);
                    }
                } else if (date === 'end') {
                    let splitYear = i.cells[index].innerText.split(' ')[2];
                    if (splitYear.indexOf(val)!=-1) {
                        result.push(i);
                    }
                } else {
                    if (i.cells[index].innerText.toLowerCase().indexOf(val)!=-1) {
                        result.push(i);
                    }
                }
            });
            return result;
        }

        function renderList(_list = [], el = document.body) {
            el.innerHTML='';
            _list.forEach(i => {
                let new_tr = document.createElement('tr');
                let newName = document.createElement('td');
                newName.innerHTML = i.cells[0].innerText;
                el.appendChild(new_tr);
                new_tr.appendChild(newName);
                let newFaculty = document.createElement('td');
                newFaculty.innerHTML = i.cells[1].innerText;
                new_tr.appendChild(newFaculty);
                let newBirthday = document.createElement('td');
                newBirthday.innerHTML = i.cells[2].innerText;
                new_tr.appendChild(newBirthday);
                let newYearsOfEducation = document.createElement('td');
                newYearsOfEducation.innerHTML = i.cells[3].innerText;
                new_tr.appendChild(newYearsOfEducation);
            });
        }

        searchName.addEventListener('input',e=>{
            let new_arr = filter(e.target.value.toLowerCase(), defaultRows, 0);
            renderList(new_arr,result);
        });

        searchFaculty.addEventListener('input',e=>{
            let new_arr = filter(e.target.value.toLowerCase(), defaultRows, 1);
            renderList(new_arr,result);
        });

        searchStartDate.addEventListener('input',e=>{
            let new_arr = filter(e.target.value.toLowerCase(), defaultRows, 3, 'start');
            renderList(new_arr,result);
        });

        searchEndDate.addEventListener('input',e=>{
            let new_arr = filter(e.target.value.toLowerCase(), defaultRows, 3, 'end');
            renderList(new_arr,result);
        });
    }

    function createForm() {
        let form = document.createElement('form');
        form.classList.add('student-form')
        container.append(form);

        let nameInput = document.createElement('input');
        nameInput.placeholder = 'Имя';
        nameInput.setAttribute('type', 'text');
        // nameInput.required = true;

        let surnameInput = document.createElement('input');
        surnameInput.placeholder = 'Фамилия';
        surnameInput.setAttribute('type', 'text');
        // surnameInput.required = true;

        let middleNameInput = document.createElement('input');
        middleNameInput.placeholder = 'Отчество';
        middleNameInput.setAttribute('type', 'text');
        // middleNameInput.required = true;

        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        todayDay = yyyy + '-' + mm + '-' + dd;

        let dateInput = document.createElement('input');
        dateInput.setAttribute('type', 'date');
        dateInput.setAttribute('min', '1900-01-01');
        dateInput.setAttribute('max', todayDay);
        // dateInput.required = true;

        let startDateInput = document.createElement('input');
        startDateInput.placeholder = 'Дата начала обучения';
        startDateInput.setAttribute('type', 'number');
        startDateInput.setAttribute('min', '2000');
        startDateInput.setAttribute('max', yyyy);
        // startDateInput.required = true;

        let facultyInput = document.createElement('input');
        facultyInput.placeholder = 'Факультет';
        facultyInput.setAttribute('type', 'text');
        // facultyInput.required = true;

        let formButton = document.createElement('button');
        formButton.classList.add('btn', 'btn-success', 'mb-3', 'col-4', 'mx-auto');
        formButton.setAttribute('type', 'submit');
        formButton.textContent = 'Добавить студента';


        let errorWindow = document.createElement('div');

        let errorsList = document.createElement('ul');
        errorWindow.append(errorsList);

        form.append(nameInput, surnameInput, middleNameInput, dateInput, startDateInput, facultyInput, errorWindow, formButton);

        let validateErrors = [];


        form.addEventListener('submit', function (e) {
            e.preventDefault();

            validateErrors = [];
            errorsList.innerHTML = '';

            if (nameInput.value.match(/^[А-Яа-яЁё]+$/)) {

            } else {
                validateErrors.push('Имя должно содержать только русские буквы');
            }

            if (surnameInput.value.match(/^[А-Яа-яЁё]+$/)) {

            } else {
                validateErrors.push('Фамилия должна содержать только русские буквы');
            }

            if (middleNameInput.value.match(/^[А-Яа-яЁё]+$/)) {

            } else {
                validateErrors.push('Отчество должно содержать только русские буквы');
            }

            if (facultyInput.value.match(/^[А-Яа-яЁё\ t ]+$/)) {
                facultyInput.value = facultyInput.value.trim();
                facultyInput.value = facultyInput.value.charAt(0).toUpperCase() + facultyInput.value.slice(1);
            } else {
                validateErrors.push('Название факультета должно содержать только русские буквы');
            }

            if (validateErrors.length === 0) {
                students.push({
                    'name': nameInput.value,
                    'surname': surnameInput.value,
                    'middleName': middleNameInput.value,
                    'date': dateInput.valueAsDate,
                    'startDate': startDateInput.value,
                    'faculty': facultyInput.value
                })
                form.reset()
            }


            for (error of validateErrors) {
                let errors = document.createElement('li');
                errors.textContent = error;
                errorsList.append(errors);
            }

            createTable()
            let extraTables = document.getElementsByTagName('table');
            while (extraTables.length > 1) {
                extraTables[1].remove();
            }
        })

        return {
            nameInput,
            surnameInput,
            middleNameInput,
            dateInput,
            startDateInput,
            facultyInput,
            formButton
        }
    }

    createTable();
    createForm();
})