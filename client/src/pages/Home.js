import React, { useRef, useEffect, useState, useContext } from "react";
import Card from "../components/Card";
import {
  deleteLink,
  getLinks,
  hasExtension,
  shrinkLink,
  triggerExtSync,
} from "../context/actions/links";
import Dots from "../components/Dots";
import Modal from "../components/Modal";
import LetterAnim from "../components/LetterAnim";
import { ReactComponent as Trash } from "../assets/trash.svg";
import { ReactComponent as Hide } from "../assets/hide.svg";
import { ReactComponent as See } from "../assets/see.svg";
import { ReactComponent as Copy } from "../assets/copy.svg";
import Flash from "../components/Flash";
import { Context } from "../context/Context";

export default function Home() {
  const [links, setActualLinks] = useState([]);
  const [hiddenLinks, setHidden] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const linksRef = useRef([]);

  const {
    links: { hidden },
    hideLink,
    unHideLink,
  } = useContext(Context);

  const flashRef = useRef();

  function showFlash(conf) {
    if (!flashRef.current) return;
    flashRef.current.show(conf);
  }

  function dismissFlash() {
    if (!flashRef.current) return;
    flashRef.current.dismiss();
  }

  function setLinks(links) {
    setActualLinks(links);
    linksRef.current = links;
  }

  useEffect(() => {
    getLinks()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return setError(error);
        setLinks(data.filter(link => !hidden.includes(link._id)));
        setHidden(data.filter(link => hidden.includes(link._id)));
        if (hasExtension()) {
          triggerExtSync();
          window.addEventListener("extension-sync", handleExtSync);
        }
      })
      .catch(({ error }) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleExtSync = ({ detail: { links: extLinks } }) => {
    setLinks([...extLinks, ...linksRef.current]);
    showFlash({ color: "green", text: "Extension Links Synchronized" });
  };

  const hideOne = _id => {
    hideLink(_id);
    setHidden([links.find(link => link._id === _id), ...hiddenLinks]);
    setLinks(links.filter(link => link._id !== _id));
  };

  const unHideOne = _id => {
    unHideLink(_id);
    setLinks([hiddenLinks.find(link => link._id === _id), ...links]);
    setHidden(hiddenLinks.filter(link => link._id !== _id));
  };

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
          hideOne={hideOne}
        />
        {hiddenLinks.length ? (
          <HiddenList links={hiddenLinks} unHideOne={unHideOne} />
        ) : (
          ""
        )}
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
  const { unsetUser } = useContext(Context);

  const textAreaRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setState("loading");
    const { error, data } = await shrinkLink(input);
    if (error) {
      if (error === "Authorization Expired" || error === "Access Denied") {
        flash.showFlash({ color: "secondary", text: "You Will Be Logged Out" });
        setTimeout(unsetUser, 1000);
      } else {
        flash.showFlash({ color: "secondary", text: "Link Shortening Failed" });
      }
      setState("Failed");
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

  const copyOutput = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.className = "copyTextArea";
    textAreaRef.current.select();
    document.execCommand("copy");
    flash.showFlash({ color: "green", text: "Link Copied" });
    textAreaRef.current.className = "hidden";
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
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Enter link"
                      value={input}
                      disabled={state === "loading"}
                      required={true}
                      onChange={e => setInput(e.target.value)}
                    />
                    <button
                      className="b-primary c-white btn"
                      onClick={handleSubmit}
                      disabled={state === "loading"}
                    >
                      {state === "loading" ? <Dots /> : "Shorten"}
                    </button>
                  </form>
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
                gripurl.com /{" "}
                <LetterAnim result={output} isLoading={state === "loading"} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={state === "success" ? "btn-row" : "hidden"}>
        <textarea
          ref={textAreaRef}
          readOnly={true}
          className="hidden"
          value={`http://gripurl.com/${output}`}
        />
        <button className="btn b-secondary shrink icon" onClick={copyOutput}>
          <Copy width="20" height="20" />
        </button>
        <button className="btn b-tertiary c-white shrink" onClick={resetInput}>
          New
        </button>
      </div>
    </Card>
  );
}

function ListCard({ links, setLinks, loading, error, flash, hideOne }) {
  const [askDelete, setAskDelete] = useState("");
  const { unsetUser } = useContext(Context);

  const tryDelete = async () => {
    const backup = [...links];
    setLinks(links.filter(link => link._id !== askDelete));
    setAskDelete("");
    const { error, data } = await deleteLink(askDelete);
    if (error || !data) {
      if (error === "Authorization Expired" || error === "Access Denied") {
        flash.showFlash({ color: "secondary", text: "You Will Be Logged Out" });
        setTimeout(unsetUser, 1000);
      } else {
        flash.showFlash({ color: "secondary", text: "Link Deletion Failed" });
      }
      return setLinks(backup);
    }
    return flash.showFlash({
      color: "green",
      text: "Link Deletion Successful",
    });
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {links.sort(sortByDate).map(item => (
                <Row
                  item={item}
                  key={item._id}
                  setAskDelete={setAskDelete}
                  hideOne={hideOne}
                />
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

function Row({ item, setAskDelete, hideOne }) {
  const hide = () => {
    hideOne(item._id);
  };
  const askDel = () => {
    setAskDelete(item._id);
  };
  return (
    <tr key={item._id}>
      <td>
        <a
          href={`http://gripurl.com/${item.ref_id}`}
          className="hoverfx c-primary"
          target="_blank"
        >
          {item.ref_id}
        </a>
      </td>
      <td className="anywhere">
        <a
          href={item.original_url}
          className="hoverfx c-secondary"
          target="_blank"
        >
          {item.original_url.split("//")[1]}
        </a>
      </td>
      <td className="luxury">{item.clicks || "0"}</td>
      <td className="luxury">{new Date(item.date).toLocaleDateString()}</td>
      <td className="b-white">
        <button
          className="btn b-primary c-white mt-2 shrink icon"
          onClick={hide}
        >
          <Hide width="20" height="20" />
        </button>
      </td>
      <td className="b-white">
        <button className="btn b-red c-white mt-2 shrink icon" onClick={askDel}>
          <Trash width="20" height="20" />
        </button>
      </td>
    </tr>
  );
}

function HiddenList({ links, unHideOne }) {
  const [collapsed, setCollapsed] = useState(true);

  const unHide = (e, _id) => {
    e.stopPropagation();
    unHideOne(_id);
  };
  return (
    <Card title="Hidden Links" onClick={() => setCollapsed(!collapsed)}>
      <p className="uppercase text-center c-gray">
        {collapsed
          ? "\u2193 Click to expand \u2193"
          : "\u2191 Click to collapse \u2191"}
      </p>
      <table className={collapsed ? "hidden" : "link-card"}>
        <tbody>
          {links.sort(sortByDate).map(item => (
            <tr key={item._id}>
              <td>
                <a
                  href={`http://gripurl.com/${item.ref_id}`}
                  className="hoverfx c-primary"
                  target="_blank"
                >
                  {item.ref_id}
                </a>
              </td>
              <td className="anywhere">
                <a
                  href={item.original_url}
                  className="hoverfx c-secondary"
                  target="_blank"
                >
                  {item.original_url.split("//")[1]}
                </a>
              </td>
              <td className="b-white">
                <button
                  className="btn b-primary c-white shrink icon"
                  onClick={e => unHide(e, item._id)}
                >
                  <See width="20" height="20" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function sortByDate(a, b) {
  if (a.date > b.date) return -1;
  else if (a.date < b.date) return 1;
  else return 0;
}
