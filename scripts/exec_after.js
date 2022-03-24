async function deal_with_size() {
    if (window.innerWidth < 650) {
        CVWIDTH = 300;
        CVHEIGHT = 300;
        RADIUS = CVWIDTH/2;
        canvas.width = CVWIDTH;
        canvas.height = CVHEIGHT;
        await reset_montecarlo();

        buffonCVWIDTH = 301;
        buffon_canvas.width = buffonCVWIDTH;
        await reset_buffon();
        
        colCVWIDTH = 300;
        colcanvas.width = colCVWIDTH;
        INIsmall_x = 220;
        INIbig_x = 250;
        await reset_collision()
    } else {
        CVWIDTH = 600;
        CVHEIGHT = 600;
        RADIUS = CVWIDTH/2;
        canvas.width = CVWIDTH;
        canvas.height = CVHEIGHT;
        await reset_montecarlo();

        buffonCVWIDTH = 601;
        buffon_canvas.width = buffonCVWIDTH;
        await reset_buffon();
        
        colCVWIDTH = 600;
        colcanvas.width = colCVWIDTH;
        INIsmall_x = 320;
        INIbig_x = 350;
        await reset_collision()
    }
}

window.onresize = deal_with_size;

deal_with_size();
