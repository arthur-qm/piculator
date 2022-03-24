function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var about_modal_container = document.getElementsByClassName('modal-container')[0];

function change_modal_content(new_content) {
    about_modal_container.children[0].innerHTML = new_content;
}

function about_modal() {
    change_modal_content("<p>This webapp shows some inneficient yet interesting ways to compute the decimal places of pi.</p><p>My github username: @arthur-qm</p>");
    if (!about_modal_container.style.display || about_modal_container.style.display === 'none')
        about_modal_container.style.display = 'block';
    else
        about_modal_container.style.display = 'none';
}

window.onclick = (ev) => {
    if (ev.target == about_modal_container)
        about_modal_container.style.display = 'none';
};

function about_collision() {
    about_modal();
    change_modal_content("<p>This calculator calculates pi by doing a simulation in which two blocks collide.</p><p>It has been mathematically proven that when the block on the right has a mass 100^d times larger than the left block's mass, then the number of collisions that happen is composed by the first d+1 digits of &pi; (including the 3 in the units digit).</p>");
}

function about_montecarlo() {
    about_modal();
    change_modal_content("<p>This method calculates pi by pĺacing random points inside this canvas and checking how many of them fall inside the circle.</p><p>Since the area of the circle is &pi;r^2 and the area of the square is (2r)^2 = 4r^2, then the probability of a point randomly appearing inside the circle is &pi;/4</p><p>Thefore, to calculate pi, it suffices to multiply the (points inside the circle)/(total points) ratio by 4.</p>");
}

function about_buffon() {
    about_modal();
    change_modal_content("<p>It has been mathematically proven that the probability of a randomly throwed match of length L falling into a plane with parallel stripes of separation T intersecting with any stripes is (2*L)/(&pi; * T)</p><p>In this particular case, I've set T = 2*L so that the probability is 1/&pi;. Hence, to calculate &pi;, you just need to invert the (matches intersecting with stripes)/(total matches) ratio.</p>")
}