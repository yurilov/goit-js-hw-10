import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBoxRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

searchBoxRef.addEventListener('input', debounce(searchHandler, DEBOUNCE_DELAY));

function searchHandler(e) {
  e.preventDefault();

  if (searchBoxRef.value) {
    const name = searchBoxRef.value.trim();
    return fetchCountries(name).then(createMarkup).catch(error);
  } else {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
  }
}

function createMarkup(countries) {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';

  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.', { timeout: 1000 });
    return;
  }
  if (countries.length >= 2) {
    countryListRef.innerHTML = createCountriesList(countries);
  }
  if (countries.length === 1) {
    countryInfoRef.innerHTML = createOneCountryMarkup(countries);
  }
}

function createCountriesList(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 1em; width: 1em"><p>${name.official}</p></li>`;
    })
    .join('');
}

function createOneCountryMarkup(countries) {
  return countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1><img src="${flags.svg}" alt="Flag of ${
        name.official
      }" style="height: 1em; width: 1em"> ${name.official}</h1>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>`;
    })
    .join('');
}

function error() {
  return Notify.failure('Oops, there is no country with that name', { timeout: 1000 });
}
