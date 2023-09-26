/* global axios */
const itemTemplate = document.querySelector("#diary-item-template");
const diaryList = document.querySelector("#diarys");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const diarys = await getDiarys();
    diarys.forEach((diary) => renderDiary(diary));
  } catch (error) {
    alert("Failed to load diarys!");
  }
}

function setupEventListeners() {
  const addDiaryButton = document.querySelector("#diary-add");

  //新增
  addDiaryButton.addEventListener("click", async () => {

    date0 = new Date();
    year = date0.getFullYear();
    month = date0.getMonth() + 1;
    day = date0.getDate();
    dayday = date0.getDay();
    if (month < 10) { month = "0" + month};
    if (day < 10) { day = "0" + day};
    var day_list = ['日', '一', '二', '三', '四', '五', '六'];

    // const dateInputCon = document.querySelector("#diary-input-container");
    // dateInputCon.innerHTML = '<input type="text" id="diary-input" placeholder="date        ex: 2023.01.01(日)" tabindex="1" />';
    const dateToday = document.querySelector("#date");
    dateToday.innerHTML = 'today is '+year + "." + month + "." + day + '(' + day_list[dayday] + ')';

    const descriptionInputCon = document.querySelector("#description-container");
    descriptionInputCon.innerHTML = '<textarea id="diary-description-input" placeholder="description" tabindex="2"></textarea>';
    
    const titleSelectCon = document.querySelector("#title-select");
    titleSelectCon.innerHTML = '<div> 標籤: </div>'+'<select id="title"> <option value="學業">學業</option> <option value="人際">人際</option> <option value="社團">社團</option> </select>';
    const moodSelectCon = document.querySelector("#mood-select");
    moodSelectCon.innerHTML = '<div> 心情: </div>'+'<select id="mood"> <option value="快樂">快樂</option> <option value="生氣">生氣</option> <option value="難過">難過</option> </select>';

    const scButton = document.querySelector("#SaveOrNot");
    scButton.innerHTML = '<button id="diary-cancel" tabindex="3">取消</button>' + '<button id="diary-save" tabindex="3">儲存</button>';

    const saveButton = document.querySelector("#diary-save");
    const cancelButton = document.querySelector("#diary-cancel");

  
    //儲存
    saveButton.addEventListener("click", async () =>{
      // const diaryInput = document.querySelector("#diary-input");
      // const diaryDescriptionInput = document.querySelector("#diary-description-input");

      // const dateInput = document.querySelector("#diary-input");
      const descriptionInput = document.querySelector("#diary-description-input");
      const titleSelect = document.querySelector("#title");
      const moodSelect = document.querySelector("#mood");
      
        

      const date = year + "." + month + "." + day + '(' + day_list[dayday] + ')';
      const title = titleSelect.value;
      const mood = moodSelect.value;
      const description = descriptionInput.value;
      
      if (!date) {
        alert("Please enter a diary date!");
        return;
      }
      if (!description) {
        alert("Please enter a diary description!");
        return;
      }
      try {
        const diary = await createDiary({ date, title, mood, description });
        renderDiary(diary);
      } catch (error) {
        alert("Failed to create diary!");
        return;
      }
      // dateInput.value = "";
      titleSelect.value = "";
      moodSelect.value = "";
      descriptionInput.value = "";

      // dateInputCon.innerHTML = null;
      dateToday.innerHTML = null;
      descriptionInputCon.innerHTML = null;
      titleSelectCon.innerHTML = null;
      moodSelectCon.innerHTML = null;
      scButton.innerHTML =  null;

    });
    
    //取消
    cancelButton.addEventListener("click", async () =>{
      // dateInputCon.innerHTML = null;
      dateToday.innerHTML = null;
      descriptionInputCon.innerHTML = null;
      titleSelectCon.innerHTML = null;
      moodSelectCon.innerHTML = null;
      scButton.innerHTML =  null;
    });

  });

}

function renderDiary(diary) {
  const item = createDiaryElement(diary);
  diaryList.appendChild(item);
}

function createDiaryElement(diary) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".diary-item");
  container.id = diary.id;
  console.log(diary);
  // const checkbox = item.querySelector(`input[type="checkbox"]`);
  // checkbox.checked = diary.completed;
  // checkbox.dataset.id = diary.id;
  const date = item.querySelector("p.diary-date");
  date.innerText = diary.date;
  const title = item.querySelector("p.diary-title");
  title.innerText = diary.title;
  const mood = item.querySelector("p.diary-mood");
  mood.innerText = diary.mood;
  const description = item.querySelector("p.diary-description");
  description.innerText = diary.description;

  // const deleteButton = item.querySelector("button.delete-diary");
  // deleteButton.dataset.id = diary.id;
  // deleteButton.addEventListener("click", () => {
  //   deleteDiaryElement(diary.id);
  // });

  const allButton = item.querySelector("p.SaveOrNot");
  const editButton = item.querySelector("button.diary-edit");
  editButton.dataset.id = diary.id;
  editButton.addEventListener("click", async () => {

    // title.innerText = null;
    // mood.innerText = null;
    // description.innerText = null;

    title.innerHTML = '<div id = "title-select"> <select id="title"> <option value="學業">學業</option> <option value="人際">人際</option> <option value="社團">社團</option> </select> </div>';
    mood.innerHTML = '<div id = "mood-select"> <select id="mood"> <option value="快樂">快樂</option> <option value="生氣">生氣</option> <option value="難過">難過</option> </select> </div>';
    description.innerHTML = '<textarea id="diary-description-input" placeholder="description" tabindex="2">'+diary.description+'</textarea>';
    
    allButton.innerHTML = '<button id="diary-cancel" tabindex="3">取消</button>' + '<button id="diary-save" tabindex="3">儲存</button>';
  
    const saveButton = document.querySelector("#diary-save");
    const cancelButton = document.querySelector("#diary-cancel");

    console.log(diary);
    //儲存
    saveButton.addEventListener("click", async () =>{
      const descriptionInput = document.querySelector("#diary-description-input");
      const titleSelect = document.querySelector("#title");
      const moodSelect = document.querySelector("#mood");

      const newdate = date.innerHTML;
      const newtitle = titleSelect.value;
      const newmood = moodSelect.value;
      const newdescription = descriptionInput.value;
  
      // console.log(newdate);
      // console.log(newtitle);
      // console.log(newmood);
      // console.log(newdescription);

      title.innerHTML = null;
      mood.innerHTML = null;
      description.innerHTML = null;
    
      title.innerText = newtitle;
      mood.innerText = newmood;
      description.innerText = newdescription;

      allButton.innerHTML = '';
      
      diary = await updateDiary(container.id, { newdate, newtitle, newmood, newdescription });
    });
    

    //取消
    cancelButton.addEventListener("click", async () =>{
      title.innerHTML = null;
      mood.innerHTML = null;
      description.innerHTML = null;
    
      title.innerText = diary.title;
      mood.innerText = diary.mood;
      description.innerText = diary.description;
      allButton.innerHTML = '';
      
      diary = await updateDiary(container.id, {date, title, mood, description});
      
    }); 

  });

  return item;
}

async function deleteDiaryElement(id) {
  try {
    await deleteDiaryById(id);
  } catch (error) {
    alert("Failed to delete diary!");
  } finally {
    const diary = document.getElementById(id);
    diary.remove();
  }
}

async function getDiarys() {
  const response = await instance.get("/diarys");
  return response.data;
}

async function createDiary(diary) {
  const response = await instance.post("/diarys", diary);
  return response.data;
}

async function updateDiary(id, diary) {
  const response = await instance.put(`/diarys/${id}`, diary);
  return response.data;
}

async function deleteDiaryById(id) {
  const response = await instance.delete(`/diarys/${id}`);
  return response.data;
}

main();
