---
layout: default
title: Bubble Sort Visualizer
date: 2026-06-28 10:00:00 +0300
categories: [cs, algorithms, visualizer]
tags: [bubble-sort, sorting, algorithms, visualizer, javascript, computer-science, education]
description: "An interactive Bubble Sort visualizer — step through comparisons, play at your own pace, or skip a full pass. Colour-coded bars show every swap in real time."
head_include: anime.html
---

<h1>Bubble Sort Visualizer</h1>

<p>
    Watch Bubble Sort compare adjacent elements and swap them into place.
</p>

<div class="controls">
    <button class="generate" onclick="generateArray()">
        Generate Array
    </button>

    <button class="sort" onclick="bubbleSort()">
        Start Bubble Sort
    </button>
</div>

<div id="array-container"></div>

<div class="info" id="status">
    Ready
</div>
<script>

    const container = document.getElementById("array-container");
    const statusText = document.getElementById("status");

    let values = [];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function generateArray() {
        container.innerHTML = "";

        values = [];

        for (let i = 0; i < 10; i++) {
            values.push(Math.floor(Math.random() * 90) + 10);
        }

        values.forEach(value => {
            const bar = document.createElement("div");

            bar.classList.add("bar");
            bar.style.height = `${value * 3}px`;
            bar.dataset.value = value;
            bar.innerText = value;

            container.appendChild(bar);
        });

        statusText.innerText = "Array Generated";
    }

    async function swapBars(bar1, bar2) {

        const x1 = bar1.offsetLeft;
        const x2 = bar2.offsetLeft;

        await anime({
            targets: bar1,
            translateX: x2 - x1,
            duration: 500,
            easing: 'easeInOutQuad'
        }).finished;

        await anime({
            targets: bar2,
            translateX: x1 - x2,
            duration: 500,
            easing: 'easeInOutQuad'
        }).finished;

        bar1.style.transform = '';
        bar2.style.transform = '';

        const next1 = bar1.nextSibling;

        container.insertBefore(bar2, bar1);

        if (next1) {
            container.insertBefore(bar1, next1);
        } else {
            container.appendChild(bar1);
        }
    }

    async function bubbleSort() {

        let bars = document.querySelectorAll(".bar");

        for (let i = 0; i < bars.length; i++) {

            for (let j = 0; j < bars.length - i - 1; j++) {

                bars = document.querySelectorAll(".bar");

                const bar1 = bars[j];
                const bar2 = bars[j + 1];

                bar1.classList.add("comparing");
                bar2.classList.add("comparing");

                statusText.innerText =
                    `Comparing ${bar1.dataset.value} and ${bar2.dataset.value}`;

                await sleep(500);

                const val1 = parseInt(bar1.dataset.value);
                const val2 = parseInt(bar2.dataset.value);

                if (val1 > val2) {

                    bar1.classList.add("swap");
                    bar2.classList.add("swap");

                    statusText.innerText =
                        `Swapping ${val1} and ${val2}`;

                    await swapBars(bar1, bar2);

                    bar1.classList.remove("swap");
                    bar2.classList.remove("swap");
                }

                bar1.classList.remove("comparing");
                bar2.classList.remove("comparing");
            }

            bars = document.querySelectorAll(".bar");
            bars[bars.length - i - 1].classList.add("sorted");
        }

        bars = document.querySelectorAll(".bar");

        bars.forEach(bar => {
            bar.classList.add("sorted");
        });

        statusText.innerText = "Sorting Complete!";
    }

    generateArray();

</script>


