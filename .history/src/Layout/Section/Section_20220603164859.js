import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Section.css";
import Modal from "../Modal/Modal";

function Section() {
  const [api, setApi] = useState(null);
  const [id, setId] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchapi = async () => {
      try {
        setApi(null);
        setError(null);
        setLoading(true);
        const response = await axios.get(
          "https://library.me.go.kr/pyxis-api/1/collections/1/search?all=k%7Ca%7Clibrary"
        );
        setApi(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchapi();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!api) return null;

  function id_relay(key) {
    setId(key);
  }

  function modal() {
    let modal = document.getElementById("modal");
    let modal_overLay = document.getElementById("modal_overLay");

    modal.style.display = "flex";
    modal_overLay.style.display = "flex";
  }

  function modal_close() {
    let modal = document.getElementById("modal");
    let modal_overLay = document.getElementById("modal_overLay");

    modal.style.display = "none";
    modal_overLay.style.display = "none";
  }

  const onPrev = async () => {
    if (page <= 1) {
      alert("첫 페이지 입니다");
      setPage(1);
      const reponse = await axios.get(
        `http://library.me.go.kr/pyxis-api/1/collections/${page}/search?all=k|a|library`
      );
      setApi(reponse.data);
      return 0;
    }

    setPage(page - 1);
    const reponse = await axios.get(
      `http://library.me.go.kr/pyxis-api/1/collections/${page}/search?all=k|a|library`
    );
    setApi(reponse.data);
  };

  const onNext = async () => {
    if (page === 9) {
      alert("마지막 페이지 입니다.");
      return 0;
    }
    setPage(page + 1);
    const reponse = await axios.get(
      `http://library.me.go.kr/pyxis-api/1/collections/${page}/search?all=k|a|library`
    );
    setApi(reponse.data);
  };

  return (
    <div id="section">
      {api.data.list.map((item, index) => {
        return (
          <div className="book" key={index} onClick={modal}>
            <img
              className="image"
              src={
                api.data.list[index].thumbnailUrl != null
                  ? api.data.list[index].thumbnailUrl.startsWith("http")
                    ? api.data.list[index].thumbnailUrl
                    : "img/book.png"
                  : "img/book.png"
              }
              onClick={() => {
                id_relay(api.data.list[index]);
              }}
              alt=""
            />
            <div className="booktitle">
              <b>{api.data.list[index].titleStatement}</b>
            </div>
          </div>
        );
      })}
      <button id="prev" onClick={onPrev}>
        이전
      </button>
      <button id="next" onClick={onNext}>
        다음
      </button>
      <b id="lang" onClick={onPrev}>
        {" "}
        &lang;{" "}
      </b>
      <b id="rang" onClick={onNext}>
        {" "}
        &rang;{" "}
      </b>
      <div id="modal_overLay" onClick={modal_close}></div>
      <Modal id={id} />
    </div>
  );
}

export default Section;
