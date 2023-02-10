const getToken = () => {
    let user = JSON.parse(localStorage.getItem("response"));
    return user.authorisation.token;
};

const setChartInfo = (stock) => {
    let prices = [];
    let dates = [];

    prices = stock.map((item) => item.price);
    if ("date" in stock[0]) {
        dates = stock.map((item) => item.date);
    } else {
        dates = stock.map((item) => item.time);
    }

    if (prices.length > 3000) {
        let newPrices = [];
        let newDates = [];
        for (let i = 0; i < prices.length; i += 1440) {
            newPrices.push(prices[i]);
            newDates.push(dates[i]);
        }
        prices = newPrices;
        dates = newDates;
    }
    document.querySelector("#chart").innerHTML = "";

    var options = {
        chart: {
            id: "chart",
            type: "area",
            height: 300,
            foreColor: "#ccc",
            toolbar: {
                autoSelected: "pan",
                show: false,
            },
        },
        colors: ["#00BAEC"],
        stroke: {
            width: 3,
        },
        grid: {
            borderColor: "#555",
            clipMarkers: false,
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            gradient: {
                enabled: true,
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        // markers: {
        //     size: 5,
        //     colors: ["#000524"],
        //     strokeColor: "#00BAEC",
        //     strokeWidth: 3,
        // },
        series: [
            {
                data: prices,
            },
        ],
        tooltip: {
            theme: "dark",
        },
        xaxis: {
            // type: "datetime",
            categories: dates,
            tickAmount: 30,
        },
        yaxis: {
            tickAmount: 5,
        },
    };
    // let options = {
    //     series: [
    //         {
    //             name: "Sales",
    //             data: prices,
    //         },
    //     ],
    //     chart: {
    //         type: "area",
    //         stacked: false,
    //         height: 300,
    //         width: 700,
    //         zoom: {
    //             enabled: false,
    //         },
    //         toolbar: {
    //             show: false,
    //         },
    //         background: "#000",
    //     },
    //     dataLabels: {
    //         enabled: false,
    //     },
    //     tooltip: {
    //         x: {
    //             format: "HH:mm:ss",
    //         },
    //         theme: "dark",
    //         style: {
    //             fontSize: "12px",
    //             fontFamily: "Roboto, sans-serif",
    //         },
    //     },
    //     fill: {
    //         type: "gradient",
    //         gradient: {
    //             shadeIntensity: 1,
    //             inverseColors: false,
    //             opacityFrom: 0.7,
    //             opacityTo: 0.3,
    //             stops: [20, 100, 100, 100],
    //         },
    //     },
    //     xaxis: {
    //         categories: dates,
    //         tickAmount: 6,
    //         labels: {
    //             style: {
    //                 colors: "#fff",
    //                 fontSize: "14px",
    //                 fontFamily: "Roboto, sans-serif",
    //             },
    //         },
    //         axisTicks: {
    //             show: true,
    //             color: "#fff",
    //         },
    //         axisBorder: {
    //             show: true,
    //             color: "#4e5c6e",
    //         },
    //         hideOverlappingLabels: false,
    //         showDuplicates: false,
    //     },
    //     yaxis: {
    //         labels: {
    //             style: {
    //                 colors: "#fff",
    //                 fontSize: "14px",
    //                 fontFamily: "Roboto, sans-serif",
    //             },
    //         },
    //         axisTicks: {
    //             show: true,
    //             color: "#fff",
    //         },
    //         axisBorder: {
    //             show: true,
    //             color: "#4e5c6e",
    //         },
    //     },
    //     legend: {
    //         show: false,
    //     },
    // };

    let chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
};

const GetData = (url) => {
    let token = getToken();
    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    };
    fetch(url, options)
        .then((response) => response.json())
        .then((response) => setChartInfo(response.stock))
        .catch((err) => console.error(err));
};

const colorBtn = (opt) => {
    let btns = document.querySelectorAll(".btn");
    btns.forEach((btn) => {
        let value = btn.getAttribute("value");
        if (value != null && value == opt) {
            btn.classList.add("blued");
        } else {
            btn.classList.remove("blued");
        }
    });
};
let opt;
const checkOpt = (id, opt) => {
    console.log("checkOpt", opt, id);
    if (opt == "month") {
        GetData(`http://${ip}:8000/api/stocks/${id}`);
        colorBtn("month");
    }
    if (opt == "week") {
        GetData(`http://${ip}:8000/api/stocks/${id}/lastweek`);
        colorBtn("week");
    }
    if (opt == "day") {
        GetData(`http://${ip}:8000/api/stocks/${id}/lastday`);
        colorBtn("day");
    }
};

//
const printTotalInvestment = (total, avg) => {
    let p = document.querySelector("#total-invest");
    p.innerHTML = `${total} €`;
    let p2 = document.querySelector("#today-value");
    p2.innerHTML = `${avg} €`;
    p.classList.add("blue");
    p2.classList.add("blue");
};
const financial = (x) => {
    return Number.parseFloat(x).toFixed(2);
};
const SumTotalInvestment = (stock) => {
    let total = 0;
    let prices = stock.map((item) => item.price);
    total = prices.reduce((a, b) => a + b, 0);
    total = financial(total);
    // take avg
    let avg = total / prices.length;
    avg = financial(avg);
    printTotalInvestment(total, avg);
    return total;
};
const getTotalInvestmentData = (card) => {
    console.log("getTotalInvestmentData");
    let id = card.getAttribute("companyId");
    url = `http://${ip}:8000/api/stocks/${id}`;
    let token = getToken();
    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    };
    fetch(url, options)
        .then((response) => response.json())
        .then((response) => SumTotalInvestment(response.stock))
        .catch((err) => console.error(err));
};

//
let company_id;
const createCompanyChart = (card) => {
    let id = card.getAttribute("companyId");
    company_id = id;
    opt = document.querySelector("select").value;
    checkOpt(id, opt);
};
document.querySelector("select").addEventListener("change", (e) => {
    opt = e.target.value;
    checkOpt(company_id, opt);
});

let oldprice;
let currentPrice;
const showRealTimeData = (response) => {
    let cards = document.querySelectorAll(".stock-card");

    if (!oldprice) {
        oldprice = response.real_time_stock.price;
        console.log("if 1 oldprice " + oldprice);
    } else {
        oldprice = currentPrice;
        console.log("else 1 oldprice " + oldprice);
    }
    currentPrice = response.real_time_stock.price;

    cards.forEach((card) => {
        let id = card.getAttribute("companyId");
        if (id == response.real_time_stock.company_id) {
            card.children[1].innerHTML = `<p>${oldprice + " €"}</p>`;
            card.children[2].innerHTML = `<span class="material-symbols-outlined"> arrow_drop_down </span><p>${
                currentPrice + " €"
            }</p>`;

            if (currentPrice > oldprice) {
                card.querySelector(".actual-value")
                    .querySelector("span")
                    .classList.add("up");
                card.querySelector(".actual-value")
                    .querySelector("span")
                    .classList.remove("down");
                //
                card.querySelector(".actual-value")
                    .querySelector("p")
                    .classList.add("blue");
                card.querySelector(".actual-value")
                    .querySelector("p")
                    .classList.remove("down");
            }
            if (currentPrice < oldprice) {
                card.querySelector(".actual-value")
                    .querySelector("span")
                    .classList.add("down");
                card.querySelector(".actual-value")
                    .querySelector("span")
                    .classList.remove("up");
                //
                card.querySelector(".actual-value")
                    .querySelector("p")
                    .classList.add("down");
                card.querySelector(".actual-value")
                    .querySelector("p")
                    .classList.remove("blue");
            }
        }
    });
};

const getRealTimeData = (id) => {
    let url = `http://${ip}:8000/api/real_time_stock/${id}/lastminute`;
    let token = getToken();
    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    fetch(url, options)
        .then((response) => response.json())
        .then((response) => {
            showRealTimeData(response);
        })
        .catch((err) => console.error(err));
};

const getCardsValues = () => {
    const cards = document.querySelectorAll(".stock-card");
    cards.forEach((card) => {
        let id = card.getAttribute("companyId");
        getRealTimeData(id);
    });
};
document.querySelector("#data-btn").addEventListener("click", getCardsValues);

setInterval(getCardsValues, 1000 * 60);

// document.querySelector(".stock-card").addEventListener("click", (e) => {
//     let card = e.target.closest(".stock-card");
//     createCompanyChart(card);
// });

// const getStock = () => {
//     let token = getToken();
//     const options = {
//         method: "GET",
//         headers: {
//             Authorization: "Bearer " + token,
//         },
//     };

//     fetch(`http://${ip}:8000/api/stocks`, options)
//         .then((response) => response.json())
//         .then((response) => {
//             fetchData = response.stocks;
//             console.log("fetchData1" + fetchData);
//         })
//         .catch((err) => console.error(err));
// };

// document.querySelector("#data-btn").addEventListener("click", getStock);

// const showDataBytime = (data) => {
//     // console.log("showDataBytime");
//     let option = document.querySelector("select").value;
//     console.log(option);
//     if (option == "day") {
//         // console.log("day");
//         let lastDate = data[2][data[2].length - 1];
//         console.log("lastdate" + lastDate);
//         let prices = data[0]
//             .filter((stock) => stock.date == lastDate)
//             .map((stock) => stock.price);
//         let times = data[0]
//             .filter((stock) => stock.date == lastDate)
//             .map((stock) => stock.time);
//         console.log("day" + prices, times);
//         setChartInfo(prices, times);
//     }
//     if (option == "week") {
//         // console.log("week");
//         let lastDate = data[2][data[2].length - 1];
//         lastDate = new Date(lastDate);
//         lastWeek = new Date(
//             lastDate.getFullYear(),
//             lastDate.getMonth(),
//             lastDate.getDate() - 7
//         );
//         lastWeek = lastWeek.toISOString().split("T")[0];
//         let prices = data[0]
//             .filter((stock) => stock.date >= lastWeek)
//             .map((stock) => stock.price);
//         let times = data[0]
//             .filter((stock) => stock.date >= lastWeek)
//             .map((stock) => stock.time);
//         console.log("week" + prices, times);
//         setChartInfo(prices, times);
//     }
//     if (option == "month") {
//         console.log("month");
//         setChartInfo(data[1], data[2]);
//     }
// };
// let id;

// const getStockData = (card) => {
//     // console.log("getStockData");
//     console.log("card" + card);
//     let id = card.getAttribute("companyId");
//     if (id != null) {
//         let companyData = fetchData.filter((stock) => stock.company_id == id);
//         let prices = companyData.map((stock) => stock.price);
//         let dates = companyData.map((stock) => stock.date);
//         let time = companyData.map((stock) => stock.time);
//         showDataBytime([companyData, prices, dates, time]);
//         return [companyData, prices, dates, time];
//     }
// };

// document.querySelectorAll("option").forEach((option) => {
//     option.addEventListener("click", () => {
//         showDataBytime(getStockData(id));
//     });
// });

// document.querySelectorAll(".stock-card").forEach((card) => {
//     card.addEventListener("click", () => {
//         getStockData(card);
//     });
// });
