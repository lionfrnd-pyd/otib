import React, { useMemo, useState } from "react";

const initialPosts = [
  {
    id: 1,
    title: "접이식 의자 2개",
    category: "가구",
    price: 18000,
    floor: "8F",
    pickupSpot: "8층 엘리베이터 앞",
    seller: "디자인팀 민수",
    status: "available",
    postedAt: "10분 전",
    description: "회의실 정리하면서 나온 제품입니다. 사용감 적고 바로 거래 가능해요.",
  },
  {
    id: 2,
    title: "유선 기계식 키보드",
    category: "전자기기",
    price: 35000,
    floor: "12F",
    pickupSpot: "12층 카페 라운지",
    seller: "개발팀 지연",
    status: "reserved",
    postedAt: "25분 전",
    description: "청축이라 타건감 좋아요. 점심시간 직거래 선호합니다.",
  },
  {
    id: 3,
    title: "텀블러 500ml",
    category: "생활",
    price: 5000,
    floor: "5F",
    pickupSpot: "5층 출입게이트",
    seller: "재무팀 혜린",
    status: "available",
    postedAt: "1시간 전",
    description: "새 제품이고 색상은 아이보리입니다.",
  },
];

const categories = ["전체", "가구", "전자기기", "생활", "도서", "기타"];
const floors = ["전체", "3F", "5F", "8F", "10F", "12F", "15F"];

function formatPrice(value) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedFloor, setSelectedFloor] = useState("전체");
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [form, setForm] = useState({
    title: "",
    category: "생활",
    price: "",
    floor: "8F",
    pickupSpot: "",
    seller: "",
    description: "",
  });

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchQuery =
        post.title.includes(query) ||
        post.description.includes(query) ||
        post.seller.includes(query);
      const matchCategory =
        selectedCategory === "전체" || post.category === selectedCategory;
      const matchFloor = selectedFloor === "전체" || post.floor === selectedFloor;
      const matchStatus = !showAvailableOnly || post.status === "available";
      return matchQuery && matchCategory && matchFloor && matchStatus;
    });
  }, [posts, query, selectedCategory, selectedFloor, showAvailableOnly]);

  const availableCount = posts.filter((post) => post.status === "available").length;

  const onCreatePost = (event) => {
    event.preventDefault();
    const newPost = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      price: Number(form.price),
      floor: form.floor,
      pickupSpot: form.pickupSpot,
      seller: form.seller,
      status: "available",
      postedAt: "방금 전",
      description: form.description,
    };

    setPosts((prev) => [newPost, ...prev]);
    setForm({
      title: "",
      category: "생활",
      price: "",
      floor: "8F",
      pickupSpot: "",
      seller: "",
      description: "",
    });
  };

  return (
    <>
      <div className="bg-shape bg-shape-one" aria-hidden="true" />
      <div className="bg-shape bg-shape-two" aria-hidden="true" />

      <main className="container">
        <header className="hero">
          <p className="eyebrow">OFFLINE TRADE IN BUILDING</p>
          <h1>동네 대신, 우리 빌딩 안에서 직거래</h1>
          <p className="hero-text">
            같은 건물 구성원끼리 빠르게 올리고 같은 층 혹은 공용 라운지에서 만나 거래하는
            내부 오프라인 마켓 MVP입니다.
          </p>

          <section className="stats">
            <article>
              <strong>{posts.length}</strong>
              <span>전체 게시글</span>
            </article>
            <article>
              <strong>{availableCount}</strong>
              <span>거래 가능</span>
            </article>
            <article>
              <strong>{floors.length - 1}</strong>
              <span>참여 층</span>
            </article>
          </section>
        </header>

        <section className="layout">
          <article className="card filter-card">
            <h2>거래글 찾기</h2>
            <div className="filter-grid">
              <label>
                검색
                <input
                  type="text"
                  placeholder="상품명, 설명, 작성자"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              <label>
                카테고리
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                거래 층
                <select
                  value={selectedFloor}
                  onChange={(event) => setSelectedFloor(event.target.value)}
                >
                  {floors.map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(event) => setShowAvailableOnly(event.target.checked)}
              />
              거래 가능한 게시글만 보기
            </label>

            <p className="result-text">검색 결과 {filteredPosts.length}건</p>
          </article>

          <article className="card form-card">
            <h2>거래글 등록</h2>
            <form className="form" onSubmit={onCreatePost}>
              <label>
                상품명
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                />
              </label>

              <div className="split-grid">
                <label>
                  카테고리
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  희망가(원)
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.price}
                    onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  />
                </label>
              </div>

              <div className="split-grid">
                <label>
                  거래 층
                  <select
                    value={form.floor}
                    onChange={(event) => setForm((prev) => ({ ...prev, floor: event.target.value }))}
                  >
                    {floors.slice(1).map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  작성자
                  <input
                    type="text"
                    required
                    value={form.seller}
                    onChange={(event) => setForm((prev) => ({ ...prev, seller: event.target.value }))}
                  />
                </label>
              </div>

              <label>
                거래 장소
                <input
                  type="text"
                  required
                  placeholder="예: 8층 엘리베이터 앞"
                  value={form.pickupSpot}
                  onChange={(event) => setForm((prev) => ({ ...prev, pickupSpot: event.target.value }))}
                />
              </label>

              <label>
                설명
                <textarea
                  rows="3"
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </label>

              <button type="submit">거래글 올리기</button>
            </form>
          </article>
        </section>

        <section className="feed">
          {filteredPosts.map((post) => (
            <article key={post.id} className="feed-card">
              <div className="feed-top">
                <span className={`status ${post.status}`}>
                  {post.status === "available" ? "거래 가능" : "예약중"}
                </span>
                <span className="time">{post.postedAt}</span>
              </div>
              <h3>{post.title}</h3>
              <p className="price">{formatPrice(post.price)}</p>
              <p className="meta">{post.category} · {post.floor} · {post.pickupSpot}</p>
              <p className="desc">{post.description}</p>
              <p className="seller">판매자: {post.seller}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
