import React, { useRef, useEffect, useState } from "react";
import Card from "../components/Card";
import { deleteLink, getLinks, shrinkLink } from "../context/actions/links";
import Dots from "../components/Dots";
import Modal from "../components/Modal";
import LetterAnim from "../components/LetterAnim";
import { ReactComponent as Trash } from "../assets/trash.svg";
import { ReactComponent as Copy } from "../assets/copy.svg";
import Flash from "../components/Flash";

export default function Home() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const flashRef = useRef();

  function showFlash(conf) {
    if (!flashRef.current) return;
    flashRef.current.show(conf);
  }

  function dismissFlash() {
    if (!flashRef.current) return;
    flashRef.current.dismiss();
  }

  useEffect(() => {
    getLinks()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return setError(error);
        setLinks(data);
      })
      .catch(({ error }) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  return (
    <>
      <div className="screen home b-primary">
        <ShrinkCard
          links={links}
          setLinks={setLinks}
          flash={{ showFlash, dismissFlash }}
        />
        <ListCard
          links={links}
          flash={{ showFlash, dismissFlash }}
          setLinks={setLinks}
          error={error}
          loading={loading}
        />
      </div>
      <Flash ref={flashRef} />
    </>
  );
}

function ShrinkCard({ setLinks, links, flash }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [state, setState] = useState("ready");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setState("loading");
    const { error, data } = await shrinkLink(input);
    if (error) {
      setState("Failed");
      flash.showFlash({ color: "secondary", text: "Link Shortening Failed" });
      return setError(error);
    }
    setOutput(data.ref_id);
    setInput(data.original_url);
    setState("success");
    flash.showFlash({ color: "green", text: "Link Shortened Successfully" });
    return setLinks([data, ...links]);
  };

  const resetInput = () => {
    setInput("");
    setOutput("");
    return setState("ready");
  };
  const stateClass =
    state === "loading"
      ? "c-secondary"
      : state === "success"
      ? "c-green"
      : "c-secondary";
  return (
    <Card title="Shorten Link">
      <div className="text-center c-red">{error}</div>
      <table className="shorten-container">
        <tbody>
          <tr>
            <td className="label luxury">
              <h2 className="uppercase c-gray">State: </h2>
            </td>
            <td className="purpose">
              <div className={`state uppercase ${stateClass}`}>{state}</div>
            </td>
          </tr>
          <tr>
            <td className="label luxury">
              <h2 className="uppercase c-gray">Input: </h2>
            </td>
            <td className="purpose">
              {state === "success" ? (
                <div className="link-input c-primary">{input}</div>
              ) : (
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Enter link"
                    value={input}
                    disabled={state === "loading"}
                    onChange={e => setInput(e.target.value)}
                  />
                  <button
                    className="b-primary c-white btn"
                    onClick={handleSubmit}
                    disabled={state === "loading"}
                  >
                    {state === "loading" ? <Dots /> : "Shorten"}
                  </button>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="label luxury">
              <h2 className="uppercase c-gray">Output: </h2>
            </td>
            <td className="purpose">
              <div className="c-primary output">
                momo.me /{" "}
                <LetterAnim result={output} isLoading={state === "loading"} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={state === "success" ? "btn-row" : "hidden"}>
        <button className="btn b-secondary shrink icon">
          <Copy width="20" height="20" />
        </button>
        <button className="btn b-tertiary c-white shrink" onClick={resetInput}>
          New
        </button>
      </div>
    </Card>
  );
}

function ListCard({ links, setLinks, loading, error, flash }) {
  const [askDelete, setAskDelete] = useState("");

  const tryDelete = async () => {
    const backup = [...links];
    setLinks(links.filter(link => link._id !== askDelete));
    setAskDelete("");
    const { error, data } = await deleteLink(askDelete);
    if (error || !data) {
      flash.showFlash({ color: "secondary", text: "Link Deletion Failed" });
      return setLinks(backup);
    }
    flash.showFlash({ color: "green", text: "Link Deletion Successful" });
    return;
  };

  if (loading) {
    return (
      <Card title="Manage Links">
        <div className="fake-space">
          <h3 className="c-primary">
            Loading
            <Dots />
          </h3>
        </div>
      </Card>
    );
  } else if (error) {
    return (
      <Card title="Manage Links">
        <div className="fake-space">
          <h3 className="c-secondary">
            ERROR: <span className="c-red">{error}</span>
          </h3>
        </div>
      </Card>
    );
  } else if (!links.length) {
    return (
      <Card title="Manage Links">
        <div className="fake-space">
          <h3 className="text-center">
            <span className="c-secondary">0</span> Links Shortened.{" "}
            <a href="#" className="c-primary hoverfx" data-text="Shorten Now.">
              Shorten Now.
            </a>
          </h3>
        </div>
      </Card>
    );
  } else {
    return (
      <>
        <Card title="Manage Links">
          <table className="link-card">
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Long URL</th>
                <th className="luxury">Clicks</th>
                <th className="luxury">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {links.map(item => (
                <tr key={item._id}>
                  <td>
                    <a
                      href={`https://momo.me/${item.ref_id}`}
                      className="hoverfx c-primary"
                      target="_blank"
                    >
                      {item.ref_id}
                    </a>
                  </td>
                  <td>
                    <a
                      href={item.original_url}
                      className="hoverfx c-secondary"
                      target="_blank"
                    >
                      {item.original_url.split("//")[1]}
                    </a>
                  </td>
                  <td className="luxury">{item.clicks || "0"}</td>
                  <td className="luxury">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="b-white">
                    <button
                      className="btn b-red c-white mt-2 shrink icon"
                      onClick={() => setAskDelete(item._id)}
                    >
                      <Trash width="20" height="20" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Modal
          title="Confirm Delete"
          actions={[
            {
              title: "Cancel",
              colors: "b-gray2 bd-gray",
              handler: () => setAskDelete(""),
            },
            {
              title: "Delete",
              colors: "b-red c-white shrink",
              handler: tryDelete,
            },
          ]}
          isOpen={askDelete}
          close={() => setAskDelete("")}
        >
          <p>Are you sure?</p>
        </Modal>
      </>
    );
  }
}
