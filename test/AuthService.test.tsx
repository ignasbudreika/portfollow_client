import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { TopNavbar } from "../src/components/TopNavbar";

let container;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
});

it("renders with login or logout button", () => {
    act(() => {
        localStorage.setItem('ACCESS_TOKEN', 'access_token');
        render(<TopNavbar></TopNavbar>, container);
    });
    expect(container.getElementsByClassName('googleLoginButton ant - btn')).toBeDefined();

    // act(() => {
    //     render(<TopNavbar />, container);
    // });

    // act(() => {
    //     render(<TopNavbar />, container);
    // });
});