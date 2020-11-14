import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { deleteLink, getLinks } from "../context/actions/links";
import Dots from "../components/Dots";
import Modal from "../components/Modal";
import LetterAnim from "../components/LetterAnim";

export default function Home() {
  return (
    <div className="screen home">
      <ShrinkCard />
      <ListCard />
    </div>
  );
}

function ShrinkCard() {
  return (
    <Card title="Shorten Link">
      <table className="shorten-container">
        <tbody>
          <tr>
            <td className="label">
              <h2 className="uppercase c-gray">Input: </h2>
            </td>
            <td className="purpose">
              <div className="input-container">
                <input type="text" placeholder="Enter link" />
                <button className="b-primary c-white btn">Shorten</button>
              </div>
            </td>
          </tr>
          <tr>
            <td className="label">
              <h2 className="uppercase c-gray">Output: </h2>
            </td>
            <td className="purpose">
              <div className="c-primary output">
                momo.me / <LetterAnim />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

function ListCard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [askDelete, setAskDelete] = useState("");
  const [error, setError] = useState("");
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

  const tryDelete = async () => {
    const backup = [...links];
    setLinks(links.filter(link => link._id !== askDelete));
    setAskDelete("");
    const { error, data } = await deleteLink(askDelete);
    if (error || !data) return setLinks(backup);
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
                <th>Link Clicks</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {links.map(item => (
                <tr key={item._id}>
                  <td>
                    <a
                      href="#"
                      className="hoverfx c-primary"
                      data-text={item.ref_id}
                    >
                      {item.ref_id}
                    </a>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="hoverfx c-secondary"
                      data-text={item.original_url}
                    >
                      {item.original_url}
                    </a>
                  </td>
                  <td>{item.clicks || "0"}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn b-red c-white mt-2"
                      onClick={() => setAskDelete(item._id)}
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Modal
          title="Confirm Delete"
          prompt="Are You Sure?"
          isOpen={askDelete}
          close={() => setAskDelete("")}
        >
          <div className="btn-row">
            <button
              className="btn b-primary c-white"
              onClick={() => setAskDelete("")}
            >
              Cancel
            </button>
            <button className="btn b-red c-white" onClick={tryDelete}>
              Delete
            </button>
          </div>
        </Modal>
      </>
    );
  }
}
