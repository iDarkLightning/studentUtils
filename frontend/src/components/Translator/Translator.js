import React, { useState, useRef } from "react";
import * as langCodes from "../../lang_codes.json";

const Translator = () => {
  const [translationText, setTranslationText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [translationLanguage, setTranslationLanguage] = useState("en");
  const [translation, setTranslation] = useState("");
  const selectLangElement = useRef(null);

  const getLangs = () => {
    let langs = [];
    for (const [key, val] of Object.entries(langCodes)) {
      langs.push(<option value={val}>{key}</option>);
    }
    return langs;
  };

  const setTranslationsHandler = async (e) => {
    setTranslationText(e.target.value);
    let trans = await (
      await fetch(
        "/api/translator?text=" +
          e.target.value +
          "&langtrans=" +
          translationLanguage +
          "&langsrc=" +
          sourceLanguage
      )
    ).json();
    setTranslation(trans);
  };

  const translationLanguageChangeHandler = async (e) => {
    setTranslationLanguage(e.target.value);
    let trans = await (
      await fetch(
        "/api/translator?text=" +
          translationText +
          "&langtrans=" +
          e.target.value +
          "&langsrc=" +
          sourceLanguage
      )
    ).json();
    setTranslation(trans);
  };

  const sourceLanguageChangeHandler = async (e) => {
    setSourceLanguage(e.target.value);
    let trans = await (
      await fetch(
        "/api/translator?text=" +
          translationText +
          "&langtrans=" +
          translationLanguage +
          "&langsrc=" +
          e.target.value
      )
    ).json();
    setTranslation(trans);
  };

  return (
    <div className="translator">
      <h1 className="translator-label">Translator</h1>
      <div className="translator-lang-selector">
        <div className="source-selector">
          <select
            ref={selectLangElement}
            onChange={sourceLanguageChangeHandler}
          >
            <option value="">Detect Language</option>
            {getLangs()}
          </select>
        </div>
        <div className="translation-selector">
          <select onChange={translationLanguageChangeHandler}>
            {getLangs()}
          </select>
        </div>
      </div>
      <div className="translator-main">
        <textarea name="translation-input" onChange={setTranslationsHandler} />
        <textarea
          placeholder="Translation"
          name="translation"
          disabled="disabled"
          value={translation}
        />
      </div>
    </div>
  );
};

export default Translator;
