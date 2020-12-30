import React, { useState } from "react";

const Definition = ({ langCode, definition, meanings, toShow }) => {
  if (!toShow) {
    return <div></div>;
  }

  if (
    definition.word === "Sorry, that word doesn't exist" ||
    meanings === undefined ||
    meanings.length === 0
  ) {
    return <h2 className="error-message">Sorry, that word doesn't exist</h2>;
  }

  const WordInfo = () => {
    const playAudio = () => {
      let audio = new Audio(definition.phonetics.map((el) => el.audio));
      audio.play();
    };

    return (
      <div className="word-info">
        <h2>{definition.word}</h2>
        <h2>[{definition.phonetics.map((el) => el.text)}]</h2>

        <div className="audio">
          <a onClick={playAudio}>
            <img className="audio-image" src="./static/assets/volume.png" />
          </a>
        </div>
      </div>
    );
  };

  const Meaning = ({ partOfSpeech }) => {
    return (
      <div>
        <h4 className="part-of-speech">{partOfSpeech}</h4>
        <ul className="definitions-list">
          {meanings.map((meaning) =>
            meaning.definitions.map((definition) => (
              <li>{definition.definition}</li>
            ))
          )}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <WordInfo />
      <ul className="meaning-partOfSpeech">
        {meanings.map((meaning) => (
          <Meaning partOfSpeech={meaning.partOfSpeech} />
        ))}
      </ul>
    </div>
  );
};

const Dictionary = () => {
  const [inputText, setInputText] = useState("");
  const [languageCode, setLanguageCode] = useState("en");
  const [definition, setDefinition] = useState({});
  const [meanings, setMeanings] = useState([{}]);
  const [hasPressed, setPress] = useState(false);

  const inputTextHandler = (e) => {
    setInputText(e.target.value);
  };

  const setDefinitionHandler = async () => {
    if (inputText === "") return;

    let definition = await (
      await fetch("/api/dictionary?word=" + inputText + "&lang=" + languageCode)
    ).json();
    setDefinition(definition);
    setMeanings(definition.meanings);
    setPress(true);
  };

  const handleKeypress = async (e) => {
    if (e.key === "Enter") {
      await setDefinitionHandler();
    }
  };

  return (
    <div className="dictionary">
      <h1 className="dictionary-label">Dictionary</h1>
      <div className="dictionary-form">
        <input
          value={inputText}
          onChange={inputTextHandler}
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
      <Definition
        className="dictionary-definition"
        toShow={hasPressed}
        definition={definition}
        meanings={meanings}
        langCode={languageCode}
      />
    </div>
  );
};

export default Dictionary;
