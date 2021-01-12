import React, { useState } from "react";

const Dictionary = () => {
  const [inputText, setInputText] = useState("");
  const [languageCode, setLanguageCode] = useState("en");
  const [definition, setDefinition] = useState({});

  const setDefinitionHandler = async () => {
    if (inputText === "") return;
    let definition = await (
      await fetch("/api/dictionary?word=" + inputText + "&lang=" + languageCode)
    ).json();
    setDefinition(definition);
  };

  const handleKeypress = async (e) => {
    if (e.key === "Enter") {
      await setDefinitionHandler();
    }
  };

  const renderData = () => {
    if (Object.keys(definition).length === 0) return;

    if (definition.error !== undefined) {
      return <h2 className="error-message">{definition.error}</h2>;
    }

    const playAudio = () => {
      let audio = new Audio(definition.phonetics.map((el) => el.audio));
      audio.play();
    };

    return (
      <div>
        <div className="word-info">
          <h2>{definition.word}</h2>
          <h2>[{definition.phonetics.map((el) => el.text)}]</h2>

          <div className="audio">
            <a onClick={playAudio}>
              <img className="audio-image" src="./static/assets/volume.png" />
            </a>
          </div>
        </div>
        <ul className="meaning-partOfSpeech">
          {definition.meanings.map((meaning) => (
            <div>
              <h4 className="part-of-speech">{meaning.partOfSpeech}</h4>
              <ul className="definitions-list">
                {definition.meanings.map((meaning) =>
                  meaning.definitions.map((definition) => (
                    <li>{definition.definition}</li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="dictionary">
      <h1 className="dictionary-label">Dictionary</h1>
      <div className="dictionary-form">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          type="text"
          className="word-input"
          placeholder="Search"
          onKeyPress={handleKeypress}
        />
        <select
          onChange={(e) => setLanguageCode(e.target.value)}
          className="lang-selector"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="ja">Japanese</option>
          <option value="ru">Russian</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="ko">Korean</option>
          <option value="pt-BR">Brazilian Protugese</option>
          <option value="ar">Arabic</option>
          <option value="tr">Turkish</option>
        </select>
        <button onClick={setDefinitionHandler} className="search-button">
          Search
        </button>
      </div>
      {renderData()}
    </div>
  );
};

export default Dictionary;
