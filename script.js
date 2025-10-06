// No require() in the browser. Axios is available globally from the CDN as `axios`.

function handleFormSubmit(event) {
  event.preventDefault(); // stop default page reload

  const form = event.currentTarget;
  const userDetails = {
    title: form.title.value,
    password: form.password.value,
  };

  axios
    .post(
      "https://crudcrud.com/api/1f48ca11f48946928d71608ec32f1712/passwordkeeper",
      userDetails
    )
    .then((res) => {
      console.log(res.data);
      display(res.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function display(userData) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");

  // Set recived id as users lists id.
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
      .delete(
        `https://crudcrud.com/api/1f48ca11f48946928d71608ec32f1712/passwordkeeper/${id}`
      )
      .then(() => {
        ul.removeChild(el);
      })
      .catch((error) => console.log(error));
  });
  editBtn.addEventListener("click", function (event) {
    const el = event.target.parentElement;
    const id = el.dataset.id;

    // Here update the data from the user inputs.
    document.getElementById("title").value = userData.title;
    document.getElementById("password").value = userData.password;

    const updateDetails = {
      uodatedTitle: userData.title,
      uodatedPassword: userData.password,
    };
    if (id) {
      axios
        .put(
          `https://crudcrud.com/api/1f48ca11f48946928d71608ec32f1712/passwordkeeper/${id}`,
          { updateDetails }
        )
        .then((res) => {
          res.data;
        })
        .catch((error) => console.log(error));
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(
      `https://crudcrud.com/api/1f48ca11f48946928d71608ec32f1712/passwordkeeper/`
    )
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
