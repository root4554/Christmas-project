const getToken = () => {
    let user = JSON.parse(localStorage.getItem("response"));
    return user.authorisation.token;
};
let fetchData = [];

const getStock = () => {
    let token = getToken();
    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    };

    fetch("http://localhost:8000/api/stocks", options)
        .then((response) => response.json())
        .then((response) => {
            fetchData = response.stocks;
            console.log(fetchData);
        })
        .catch((err) => console.error(err));
};

document.querySelector("#data-btn").addEventListener("click", getStock);

const setChartInfo = (prices, dates) => {
    console.log("setChartInfo");
    document.querySelector("#chart").innerHTML = "";
    let options = {
        series: [
            {
                name: "Sales",
                data: prices,
            },
        ],
        chart: {
            type: "area",
            stacked: false,
            height: 300,
            width: 700,
            zoom: {
                enabled: false,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.45,
                // opacityTo: 0.05,
                // stops: [20, 100, 100, 100],
            },
        },
        xaxis: {
            categories: dates,
            // type: "datetime",
            hideOverlappingLabels: false,
            showDuplicates: false,
        },
    };

    let chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
};

const showDataBytime = (data) => {
    console.log("showDataBytime");
    let option = document.querySelector("select").value;

    if (option == "day") {
        let lastDate = data[2][data[2].length - 1];
        let prices = data[0]
            .filter((stock) => stock.date == lastDate)
            .map((stock) => stock.price);
        let times = data[2]
            .filter((stock) => stock.date == lastDate)
            .map((stock) => stock.time);
        console.log("day" + prices, times);
        setChartInfo(prices, times);
    } else if (option == "week") {
        let lastDate = data[2][data[2].length - 1];
        lastWeek = lastDate - 7;
        let prices = data[0]
            .filter((stock) => stock.date == lastDate)
            .map((stock) => stock.price);
        let times = data[0]
            .filter((stock) => stock.date == lastDate)
            .map((stock) => stock.time);
        console.log("week" + prices, times);
        setChartInfo(prices, times);
    } else if (option == "month") {
        setChartInfo("month" + data[1], data[2]);
    }
};
let id;

const getStockData = (card) => {
    console.log("getStockData");
    let id = card.getAttribute("companyId");
    if (id != null) {
        let companyData = fetchData.filter((stock) => stock.company_id == id);
        let prices = companyData.map((stock) => stock.price);
        let dates = companyData.map((stock) => stock.date);
        let time = companyData.map((stock) => stock.time);
        console.log(companyData, prices, dates, time);
        showDataBytime([companyData, prices, dates, time]);
        return [companyData, prices, dates, time];
    }
};

document.querySelectorAll("option").forEach((option) => {
    option.addEventListener("click", () => {
        showDataBytime(getStockData(id));
    });
});

document.querySelectorAll(".stock-card").forEach((card) => {
    card.addEventListener("click", () => {
        getStockData(card);
    });
});
