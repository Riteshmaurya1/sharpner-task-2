const globalLink =
  "https://crudcrud.com/api/e391b7bd88b7441b972a63bcad6f58c3/passwordkeeper";

let currentEditId = null;

function handleFormSubmit(event) {
  event.preventDefault(); // stop default page reload

  const form = event.currentTarget;
  const userDetails = {
    title: form.title.value,
    password: form.password.value,
  };

  async function fucntioncall() {
    try {
      if (currentEditId !== null) {
        await axios.put(`${globalLink}/${currentEditId}`, userDetails);
        const existingList = document.querySelector(
          `li[data-id="${currentEditId}"]`
        );
        if (existingList) {
          const span = existingList.querySelector("span");
          span.textContent = `${userDetails.title} - ${userDetails.password}`;
        }
        currentEditId = null;
      } else {
        const res = await axios.post(globalLink, userDetails);
        display(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  fucntioncall();
  event.target.reset();
}

function display(userData) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");

  if (userData._id) {
    li.dataset.id = userData._id;
  }

  // Make a new span tag for the combining the elements.
  const span = document.createElement("span");
  span.textContent = `${userData.title} - ${userData.password}`;
  // then append to the main li.
  li.appendChild(span);

  // then add delete and edit button on users list.
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style = "background:purple;color:white;radius:1px;";
  li.appendChild(deleteBtn);

  // then make a edit button on the users lists.
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  li.appendChild(editBtn);

  // then appnd the both button wit li to the ul.
  ul.appendChild(li);

  // then make delete functionlity in the users lists.
  deleteBtn.addEventListener("click", function (event) {
    const el = event.target.parentElement;
    const id = el.dataset.id;

    axios
      .delete(`${globalLink}/${id}`)
      .then(() => {
        ul.removeChild(el);
      })
      .catch((error) => console.log(error));
  });

  editBtn.addEventListener("click", async function (event) {
    const el = event.target.parentElement;
    const id = el.dataset.id;

    // Prefill inputs with current values shown in UI
    document.getElementById("title").value = userData.title;
    document.getElementById("password").value = userData.password;

    if (!id) return;
    currentEditId = id;
  });
}
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(globalLink)
    .then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        display(res.data[i]);
      }
    })
    .catch((error) => console.log(error));
});

// Attach handler after DOM is ready
document
  .getElementById("password-form")
  .addEventListener("submit", handleFormSubmit);
