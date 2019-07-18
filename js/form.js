'use strict';

(function () {
  var MAX_TAGS_AMOUNT = 5;
  var MAX_TAG_LENGTH = 20;

  var uploadPhotoCommentElement = document.querySelector('.text__description');
  var textHashtagsElement = document.querySelector('.text__hashtags');
  var form = document.querySelector('.img-upload__form');

  function showSuccessMessage() {
    var successTemplateElement = document.querySelector('#success')
    .content
    .querySelector('.success')
    .cloneNode(true);
    var mainElement = document.querySelector('main');
    var successButton = successTemplateElement.querySelector('.success__button');

    function closeSuccessPopup() {
      mainElement.removeChild(successTemplateElement);
      successButton.removeEventListener('click', onSuccessButtonClick);
      document.removeEventListener('keydown', onSuccessEscKeydown);
      document.removeEventListener('click', onSuccessDocumentClick);
    }

    function onSuccessButtonClick() {
      closeSuccessPopup();
    }

    function onSuccessEscKeydown(evt) {
      if (window.util.isEsc(evt)) {
        closeSuccessPopup();
      }
    }

    function onSuccessDocumentClick(evt) {
      if (evt.target === successTemplateElement) {
        closeSuccessPopup();
      }
    }

    mainElement.appendChild(successTemplateElement);
    successButton.addEventListener('click', onSuccessButtonClick);
    document.addEventListener('keydown', onSuccessEscKeydown);
    document.addEventListener('click', onSuccessDocumentClick);
  }

  function showErrorMessage(message) {
    var errorTemplateElement = document.querySelector('#error')
      .content
      .querySelector('.error')
      .cloneNode(true);
    var mainElement = document.querySelector('main');
    var errorButtons = errorTemplateElement.querySelector('.error__buttons');
    var errorTitle = errorTemplateElement.querySelector('.error__title');

    function closeErrorPopup() {
      mainElement.removeChild(errorTemplateElement);
      errorButtons.removeEventListener('click', onErrorButtonClick);
      document.removeEventListener('keydown', onErrorEscKeydown);
      document.removeEventListener('click', onErrorDocumentClick);
    }

    function onErrorButtonClick() {
      closeErrorPopup();
    }

    function onErrorEscKeydown(evt) {
      if (window.util.isEsc(evt)) {
        closeErrorPopup();
      }
    }

    function onErrorDocumentClick(evt) {
      if (evt.target === errorTemplateElement) {
        closeErrorPopup();
      }
    }

    errorTitle.textContent = message;
    mainElement.appendChild(errorTemplateElement);
    errorButtons.addEventListener('click', onErrorButtonClick);
    document.addEventListener('keydown', onErrorEscKeydown);
    document.addEventListener('click', onErrorDocumentClick);
  }

  function setFormDefault() {
    uploadPhotoCommentElement.value = '';
    textHashtagsElement.value = '';
  }

  function onLoad() {
    window.popupSetup.close();
    showSuccessMessage();
  }

  function onError(message) {
    window.popupSetup.close();
    showErrorMessage(message);
  }

  function isTagWithoutHash(array) {
    return array.some(function (tag) {
      return tag[0] !== '#';
    });
  }

  function isNoSpaceBetween(array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].indexOf('#', 1) !== -1) {
        return true;
      }
    }

    return false;
  }

  function isOnlyHash(array) {
    return array.some(function (tag) {
      return tag[0] === '#' && tag.length === 1;
    });
  }

  function isLongerThan(array, max) {
    return array.some(function (tag) {
      return tag.length > max;
    });
  }

  function isSameHash(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var lastElement = array[i];
      if (array.indexOf(lastElement) !== i) {
        return true;
      }
    }

    return false;
  }

  function formCheck() {
    var tagsArray = textHashtagsElement.value.toLowerCase().split(' ');
    textHashtagsElement.setCustomValidity('');

    if (textHashtagsElement.value.trim() === '') {
      textHashtagsElement.setCustomValidity('');
    }

    if (tagsArray.length > 5) {
      textHashtagsElement.setCustomValidity('Количество комментариев не должно быть больше ' + MAX_TAGS_AMOUNT);
    }

    if (isTagWithoutHash(tagsArray)) {
      textHashtagsElement.setCustomValidity('Каждый хештег должен начинаться с решетки');
    }

    if (isOnlyHash(tagsArray)) {
      textHashtagsElement.setCustomValidity('Хештег не может состоять только из одной решетки');
    }

    if (isNoSpaceBetween(tagsArray)) {
      textHashtagsElement.setCustomValidity('Каждый хештег должен разделяться пробелом');
    }

    if (isLongerThan(tagsArray, MAX_TAG_LENGTH)) {
      textHashtagsElement.setCustomValidity('Длина тега не может быть больше ' + MAX_TAG_LENGTH + ' символов, включая решетку');
    }

    if (isSameHash(tagsArray)) {
      textHashtagsElement.setCustomValidity('Нельзя использовать несколько одинаковых хештегов');
    }

  }

  function onFormSubmit(evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onLoad, onError);
  }

  function init() {
    form.addEventListener('submit', onFormSubmit);
  }

  function destroy() {
    form.removeEventListener('submit', onFormSubmit);
  }

  textHashtagsElement.addEventListener('change', formCheck);


  window.form = {
    default: setFormDefault,
    init: init,
    destroy: destroy
  };
})();